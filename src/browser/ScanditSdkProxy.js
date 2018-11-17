var BarcodeState;
(function (BarcodeState) {
    BarcodeState[BarcodeState["Shown"] = 0] = "Shown";
    BarcodeState[BarcodeState["Scanning"] = 1] = "Scanning";
    BarcodeState[BarcodeState["Paused"] = 2] = "Paused";
    BarcodeState[BarcodeState["Hidden"] = 3] = "Hidden";
})(BarcodeState || (BarcodeState = {}));
var BarcodePickerDom = /** @class */ (function () {
    function BarcodePickerDom(onScanCallback) {
        var _this = this;
        this.onScanCallback = onScanCallback;
        this.onScanButtonClicked = function () {
            var value = _this.manualScanBox.value;
            if (value.length > 0) {
                _this.onScanCallback(value);
            }
        };
        this.refreshHistory = function (barcodes) {
            _this.recentScanList.innerHTML = "";
            barcodes.forEach(function (barcode) {
                var item = document.createElement("li");
                item.onclick = function () {
                    _this.onScanCallback(barcode);
                };
                item.innerHTML = barcode;
                _this.recentScanList.appendChild(item);
            });
        };
        var bodyElement = document.getElementsByTagName("body")[0];
        this.container = document.createElement("div");
        this.container.id = "yontech-scandit-browser-mock";
        this.container.innerHTML = "\n        <input class='manual-scan-box' type='text' /> <button class='scan-button'>Scan</button>\n        <ul class='recent-scan-list'>\n        </ul>\n    ";
        bodyElement.appendChild(this.container);
        var cssElem = document.createElement("link");
        cssElem.href =
            "plugins/yontech.scandit-browser-mock/src/browser/ScanditSdkProxy.css";
        cssElem.rel = "stylesheet";
        bodyElement.appendChild(cssElem);
        this.scanButton = this.container.getElementsByClassName("scan-button")[0];
        this.manualScanBox = this.container.getElementsByClassName("manual-scan-box")[0];
        this.recentScanList = this.container.getElementsByClassName("recent-scan-list")[0];
        this.scanButton.onclick = this.onScanButtonClicked;
        this.setState(BarcodeState.Hidden);
    }
    BarcodePickerDom.prototype.setMargins = function (margins) {
        if (margins === void 0) { margins = {
            leftMargin: 0,
            rightMargin: 0,
            topMargin: 0,
            bottomMargin: 0
        }; }
        var style = [
            "top:" + margins.topMargin + "px",
            "right:" + margins.rightMargin + "px",
            "bottom:" + margins.bottomMargin + "px",
            "left:" + margins.leftMargin + "px"
        ].join(";");
        this.container.setAttribute("style", style);
    };
    BarcodePickerDom.prototype.setState = function (state) {
        this.state = state;
        this.container.className = "scandit-mocked-scanner " + BarcodeState[this.state] + "-state";
    };
    BarcodePickerDom.prototype.distroy = function () {
        this.container.remove();
    };
    return BarcodePickerDom;
}());
var ScanditMockedSdk = /** @class */ (function () {
    function ScanditMockedSdk() {
        var _this = this;
        this.HISTORY_LOCALSTORAGE_KEY = "ScanditMockHistory";
        this.historyBarcodes = new Array();
        this.sendScan = function (barcode) {
            _this.historyBarcodes = _this.historyBarcodes.filter(function (b) { return b !== barcode; });
            _this.historyBarcodes = [barcode].concat(_this.historyBarcodes);
            window.localStorage.setItem(_this.HISTORY_LOCALSTORAGE_KEY, JSON.stringify(_this.historyBarcodes));
            _this.dom.refreshHistory(_this.historyBarcodes);
            var codes = [
                {
                    compositeFlag: 1,
                    symbology: "symbol1",
                    data: barcode,
                    rawData: barcode,
                    uniqueId: 1
                }
            ];
            _this.successCallback([
                "didScan",
                {
                    newlyRecognizedCodes: codes,
                    allRecognizedCodes: codes,
                    newlyLocalizedCodes: codes
                }
            ]);
        };
        this.show = function (success, error, options) {
            _this.successCallback = success;
            _this.dom.setState(BarcodeState.Shown);
        };
        this.resize = function (s, e, options) {
            console.log("Scandit Resize");
            _this.dom.setMargins(options[0].portraitConstraints);
        };
        this.finishDidScanCallback = function () { };
        this.dom = new BarcodePickerDom(this.sendScan);
        this.dom.setMargins();
        this.dom.setState(BarcodeState.Hidden);
        var localHistory = window.localStorage.getItem(this.HISTORY_LOCALSTORAGE_KEY);
        this.historyBarcodes = JSON.parse(localHistory || "[]");
        this.dom.refreshHistory(this.historyBarcodes);
    }
    ScanditMockedSdk.prototype.initLicense = function (s, e, options) {
        console.log("License key was set: " + options[0]);
    };
    ScanditMockedSdk.prototype.start = function (onSuccess, onError, options) {
        console.log("started inn " + options[0].paused);
    };
    return ScanditMockedSdk;
}());
var require = window["cordova"].require;
require("cordova/exec/proxy").add("ScanditSDK", new ScanditMockedSdk());
try {
    if (!require("yontech.scandit-browser-mock.ScanditSdkProxy")) {
        console.log("ye");
    }
}
catch (_a) {
    window["cordova"].define("yontech.scandit-browser-mock.ScanditSdkProxy", function () { });
}
//# sourceMappingURL=ScanditSdkProxy.js.map