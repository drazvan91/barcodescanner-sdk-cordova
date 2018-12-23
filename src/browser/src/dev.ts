enum BarcodeState {
  STOPPED = 2,
  ACTIVE = 3,
  PAUSED = 1
}

class BarcodePickerDom {
  private state: BarcodeState;
  private container: HTMLDivElement;
  private scanButton: HTMLButtonElement;
  private manualScanBox: HTMLInputElement;
  private recentScanList: HTMLUListElement;

  constructor(private onScanCallback: (barcode: string) => void) {
    const bodyElement = document.getElementsByTagName("body")[0];
    this.container = document.createElement("div");
    this.container.id = "yontech-scandit-browser-mock";
    this.container.innerHTML = `
          <div class="paused-container">
              Scanner is in pause
          </div>
          <div class="scanning-container">
              <input class='manual-scan-box' type='text' /> <button class='scan-button'>Scan</button>
              <ul class='recent-scan-list'>
              </ul>
          </div>
        `;
    bodyElement.appendChild(this.container);
    const cssElem = document.createElement("style");
    cssElem.innerText = `
          .scandit-mocked-scanner {
              position: fixed;
              background-color: #e7fbf5;
              display: flex;
              justify-content: center;
              flex-direction: column;
              text-align: center;
          }
          
          .scandit-mocked-scanner.STOPPED-state{d
              display: none;
          }  
  
          .scandit-mocked-scanner .paused-container { 
              display:none;
          }
  
          .scandit-mocked-scanner .scanning-container { 
              display:none;
          }
  
          .scandit-mocked-scanner.PAUSED-state .paused-container { display: block }
          .scandit-mocked-scanner.ACTIVE-state .scanning-container { display: block;}
      `;
    bodyElement.appendChild(cssElem);

    this.scanButton = this.container.getElementsByClassName("scan-button")[0] as HTMLButtonElement;
    this.manualScanBox = this.container.getElementsByClassName("manual-scan-box")[0] as HTMLInputElement;
    this.recentScanList = this.container.getElementsByClassName("recent-scan-list")[0] as HTMLUListElement;

    this.scanButton.onclick = this.onScanButtonClicked;

    this.setState(BarcodeState.STOPPED);
  }

  private onScanButtonClicked = () => {
    const value = this.manualScanBox.value;
    if (value.length > 0) {
      this.onScanCallback(value);
    }
  };

  public refreshHistory = (barcodes: string[]) => {
    this.recentScanList.innerHTML = "";
    barcodes.forEach(barcode => {
      const item = document.createElement("li");
      item.onclick = () => {
        this.onScanCallback(barcode);
      };
      item.innerHTML = barcode;

      this.recentScanList.appendChild(item);
    });
  };

  public setMargins(
    margins: Constraints = {
      leftMargin: "0",
      rightMargin: "0",
      topMargin: "0",
      bottomMargin: "0"
    }
  ) {
    var style = [
      "top:" + margins.topMargin,
      "right:" + margins.rightMargin,
      "bottom:" + margins.bottomMargin,
      "left:" + margins.leftMargin
    ].join(";");

    this.container.setAttribute("style", style);
  }

  public setState(state: BarcodeState) {
    this.state = state;
    this.container.className = `scandit-mocked-scanner ${BarcodeState[this.state]}-state`;
  }

  public distroy() {
    this.container.remove();
  }
}

interface Constraints {
  leftMargin: string;
  topMargin: string;
  rightMargin: string;
  bottomMargin: string;
}

interface Barcode {
  symbology: string;
  data: string;
  rawData: string;
  compositeFlag: any;
  uniqueId?: number;
}
interface Session {
  newlyRecognizedCodes: Barcode[];
  newlyLocalizedCodes: Barcode[];
  allRecognizedCodes: Barcode[];
}

type SuccessCallback = (options: any[]) => void;

class ScanditMockedSdk {
  private readonly HISTORY_LOCALSTORAGE_KEY = "ScanditMockHistory";
  private successCallback: SuccessCallback;
  private dom?: BarcodePickerDom;
  private historyBarcodes = new Array<string>();
  private continuousMode = false;

  constructor() {
    this.dom = new BarcodePickerDom(this.sendScan);
    this.dom.setMargins();
    this.dom.setState(BarcodeState.STOPPED);

    const localHistory = window.localStorage.getItem(this.HISTORY_LOCALSTORAGE_KEY);
    this.historyBarcodes = JSON.parse(localHistory || "[]");
    this.dom.refreshHistory(this.historyBarcodes);
  }

  private log(message: string): void {
    console.log("[ScanditSdkMock: " + message);
  }

  private sendScan = (barcode: string) => {
    this.historyBarcodes = this.historyBarcodes.filter(b => b !== barcode);
    this.historyBarcodes = [barcode, ...this.historyBarcodes];
    window.localStorage.setItem(this.HISTORY_LOCALSTORAGE_KEY, JSON.stringify(this.historyBarcodes));

    this.dom.refreshHistory(this.historyBarcodes);

    const codes: Barcode[] = [
      {
        compositeFlag: 1,
        symbology: "symbol1",
        data: barcode,
        rawData: barcode,
        uniqueId: 1
      }
    ];

    this.successCallback([
      "didScan",
      {
        newlyRecognizedCodes: codes,
        allRecognizedCodes: codes,
        newlyLocalizedCodes: codes
      }
    ]);
  };

  private setState(state: BarcodeState): void {
    console.log("aaaasdfsdfsfsdf" + state);
    this.dom.setState(state);
    if (this.successCallback) {
      this.successCallback(["didChangeState", state]);
    }
  }

  public initLicense(s: null, e: null, options: string[]): void {
    this.log("initLicense called: " + options[0]);
  }

  public show = (success, error, options: [{}, { portraitConstraints: Constraints }]) => {
    this.log("show called");
    this.successCallback = success;

    this.dom.setMargins(options[1].portraitConstraints);
    this.setState(BarcodeState.PAUSED);
  };

  public start(onSuccess: null, onError: null, options: [{ continuousMode: boolean; paused: boolean }]) {
    this.log("start with paused:" + options[0].paused);
    this.continuousMode = options[0].continuousMode;
    if (options[0].paused === false) {
      this.setState(BarcodeState.ACTIVE);
    }
  }

  public resize = (
    s: null,
    e: null,
    options: [
      {
        portraitConstraints: Constraints;
        landscapeConstraints: Constraints;
        animationDuration: any;
      }
    ]
  ) => {
    this.log("resize called");
    this.dom.setMargins(options[0].portraitConstraints);
  };

  public pause(onSuccess: null, onError: null, options: any[]): void {
    this.log("pause called");
    this.dom.setState(BarcodeState.PAUSED);
  }

  public stop(onSuccess: null, onError: null, options: any[]): void {
    this.log("stop called");
    this.setState(BarcodeState.STOPPED);
  }

  public finishDidScanCallback(onSuccess: null, onError: null, options: any[]): void {
    const nextStep = options[0];
    if (nextStep === 1) {
      this.pause(null, null, null);
    } else if (nextStep == 2) {
      this.stop(null, null, null);
    } else {
      if (this.continuousMode === false) {
        this.stop(null, null, null);
      }
    }
  }
}

export function init() {
  console.log("hacking scandig");
  const mocked = new ScanditMockedSdk();
  const proxy = window["scandit-sdk-proxy"];
  proxy.show = (s, e, o) => mocked.show(s, e, o);
  proxy.start = (s, e, o) => mocked.start(s, e, o);
  proxy.pause = (s, e, o) => mocked.pause(s, e, o);
  proxy.resize = (s, e, o) => mocked.resize(s, e, o);
  proxy.finishDidScanCallback = (s, e, o) => mocked.finishDidScanCallback(s, e, o);
  proxy.stop = (s, e, o) => mocked.stop(s, e, o);
}
