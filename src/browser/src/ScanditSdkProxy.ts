enum BarcodeState {
  Shown,
  Scanning,
  Paused,
  Hidden
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
        <input class='manual-scan-box' type='text' /> <button class='scan-button'>Scan</button>
        <ul class='recent-scan-list'>
        </ul>
    `;
    bodyElement.appendChild(this.container);
    const cssElem = document.createElement("link");
    cssElem.href = "plugins/yontech.scandit-browser-mock/src/browser/ScanditSdkProxy.css";
    cssElem.rel = "stylesheet";
    bodyElement.appendChild(cssElem);

    this.scanButton = this.container.getElementsByClassName("scan-button")[0] as HTMLButtonElement;
    this.manualScanBox = this.container.getElementsByClassName("manual-scan-box")[0] as HTMLInputElement;
    this.recentScanList = this.container.getElementsByClassName("recent-scan-list")[0] as HTMLUListElement;

    this.scanButton.onclick = this.onScanButtonClicked;

    this.setState(BarcodeState.Hidden);
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
      leftMargin: 0,
      rightMargin: 0,
      topMargin: 0,
      bottomMargin: 0
    }
  ) {
    var style = [
      "top:" + margins.topMargin + "px",
      "right:" + margins.rightMargin + "px",
      "bottom:" + margins.bottomMargin + "px",
      "left:" + margins.leftMargin + "px"
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
  leftMargin: number;
  topMargin: number;
  rightMargin: number;
  bottomMargin: number;
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

  constructor() {
    this.dom = new BarcodePickerDom(this.sendScan);
    this.dom.setMargins();
    this.dom.setState(BarcodeState.Hidden);

    const localHistory = window.localStorage.getItem(this.HISTORY_LOCALSTORAGE_KEY);
    this.historyBarcodes = JSON.parse(localHistory || "[]");
    this.dom.refreshHistory(this.historyBarcodes);
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

  public initLicense(s: null, e: null, options: string[]): void {
    console.log("License key was set: " + options[0]);
  }

  public show = (success, error, options) => {
    this.successCallback = success;

    this.dom.setState(BarcodeState.Shown);
  };

  public start(onSuccess: null, onError: null, options: [{ paused: boolean }]) {
    console.log("started inn " + options[0].paused);
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
    console.log("Scandit Resize");
    this.dom.setMargins(options[0].portraitConstraints);
  };

  public finishDidScanCallback = () => {};
}

const require: (
  r: string
) => {
  add: (pluginName: string, obj: any) => void;
} = window["cordova"].require;

require("cordova/exec/proxy").add("ScanditSDK", new ScanditMockedSdk());
try {
  if (!require("yontech.scandit-browser-mock.ScanditSdkProxy")) {
    console.log("ye");
  }
} catch {
  window["cordova"].define("yontech.scandit-browser-mock.ScanditSdkProxy", function() {});
}
