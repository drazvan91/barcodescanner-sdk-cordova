var Rect = cordova.require("com.mirasense.scanditsdk.plugin.Rect");
var Point = cordova.require("com.mirasense.scanditsdk.plugin.Point");
var SymbologySettings = cordova.require("com.mirasense.scanditsdk.plugin.SymbologySettings");


function ScanSettings() {
    this.symbologies = {};
}

ScanSettings.CameraFacing = {
	BACK: "back",
	FRONT: "front"
}

ScanSettings.WorkingRange = {
	STANDARD: "standard",
	LONG: "long"
}

ScanSettings.prototype.getSymbologySettings = function(symbology) {
	if (symbology in this.symbologies) {
		return this.symbologies[symbology];
	} else {
		return new SymbologySettings();
	}
}

ScanSettings.prototype.setSymbologyEnabled = function(symbology, enabled) {
	var symbologySettings = this.getSymbologySettings(symbology);
	symbologySettings.enabled = enabled;
	this.symbologies[symbology] = symbologySettings;
}

module.exports = ScanSettings;