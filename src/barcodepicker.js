
var ScanOverlay = cordova.require("com.mirasense.scanditsdk.plugin.ScanOverlay");
var ScanSettings = cordova.require("com.mirasense.scanditsdk.plugin.ScanSettings");
var ScanSession = cordova.require("com.mirasense.scanditsdk.plugin.ScanSession");
var Barcode = cordova.require("com.mirasense.scanditsdk.plugin.Barcode");
var Constraints = cordova.require("com.mirasense.scanditsdk.plugin.Constraints");

function BarcodePicker(scanSettings) {
	if (scanSettings instanceof ScanSettings) {
		this.scanSettings = scanSettings;
	} else {
		this.scanSettings = new ScanSettings();
	}

	// Keep the overlay private.
	var overlay = new ScanOverlay();
	this.getOverlayView = function() {
		return overlay;
	}

    this.isShown = false;
    
    this.executingCallback = false;
    this.pausedDuringCallback = false;
    this.stoppedDuringCallback = false;
    
	this.continuousMode = false;
	this.portraitMargins = null;
	this.landscapeMargins = null;
	this.orientations = [];
}

BarcodePicker.Orientation = {
	PORTRAIT: "portrait",
	PORTRAIT_UPSIDE_DOWN: "portraitUpsideDown",
	LANDSCAPE_RIGHT: "landscapeLeft",
	LANDSCAPE_LEFT: "landscapeRight"
}


BarcodePicker.prototype.show = function(success, manual, failure) {
	var options = {"continuousMode": this.continuousMode};

    if (this.portraitConstraints != null) options["portraitConstraints"] = this.portraitConstraints;
	if (this.landscapeConstraints != null) options["landscapeConstraints"] = this.landscapeConstraints;

	if (this.orientations.length > 0) {
		options["orientations"] = this.orientations;
	}
	var picker = this;
	cordova.exec(function(session) {
		picker.executingCallback = true;
    	picker.pausedDuringCallback = false;
    	picker.stoppedDuringCallback = false;
    	
		if (typeof session === 'string' || session instanceof String) {
			if (manual) {			
				manual(session);
			}
		} else if (success) {
			var newlyRecognized = BarcodePicker.codeArrayFromGenericArray(session.newlyRecognizedCodes);
			var newlyLocalized = BarcodePicker.codeArrayFromGenericArray(session.newlyLocalizedCodes);
			var all = BarcodePicker.codeArrayFromGenericArray(session.allRecognizedCodes);
			var properSession = new ScanSession(newlyRecognized, newlyLocalized, all);
    		
			success(properSession);
		}
		
		picker.executingCallback = false;
		var nextStep = 0;
		if (picker.stoppedDuringCallback) {
			nextStep = 2;
		} else if (picker.pausedDuringCallback) {
			nextStep = 1;
		}
		cordova.exec(null, null, "ScanditSDK", "finishDidScanCallback", [nextStep]);
	
	}, failure, "ScanditSDK", "show", [this.scanSettings, options, this.getOverlayView()]);

    this.isShown = true;
    this.getOverlayView().pickerIsShown = true;
}

BarcodePicker.codeArrayFromGenericArray = function(genericArray) {
	var codeArray = [];
	for (var i = 0; i < genericArray.length; i++) {
		var code = new Barcode(genericArray[i].gs1DataCarrier, genericArray[i].recognized);
		code.symbology = genericArray[i].symbology;
		code.data = genericArray[i].data;
		codeArray.push(code);
	}
	return codeArray;
}

BarcodePicker.prototype.applyScanSettings = function(settings) {
	if (this.isShown && settings instanceof ScanSettings) {
		cordova.exec(null, null, "ScanditSDK", "applySettings", [settings]);
	}
}

BarcodePicker.prototype.cancel = function() {
    this.isShown = false;
    this.getOverlayView().pickerIsShown = false;
    cordova.exec(null, null, "ScanditSDK", "cancel", []);
}

BarcodePicker.prototype.startScanning = function(paused) {
    if (!this.isShown) {
        return;
    }
    var options = {
        paused : paused !== undefined ? !!paused : false
    };
    cordova.exec(null, null, "ScanditSDK", "start", [options]);
}

BarcodePicker.prototype.stopScanning = function() {
	if (this.isShown) {
		if (this.executingCallback) {
			this.stoppedDuringCallback = true;
		} else {
	    	cordova.exec(null, null, "ScanditSDK", "stop", []);
	    }
    }
}

BarcodePicker.prototype.pauseScanning = function() {
	if (this.isShown) {
		if (this.executingCallback) {
			this.pausedDuringCallback = true;
		} else {
	    	cordova.exec(null, null, "ScanditSDK", "pause", []);
	    }
	}
}

BarcodePicker.prototype.resumeScanning = function() {
	if (this.isShown) {
    	cordova.exec(null, null, "ScanditSDK", "resume", []);
    }
}

BarcodePicker.prototype.switchTorchOn = function(enabled) {
	if (this.isShown) {
    	cordova.exec(null, null, "ScanditSDK", "torch", [enabled]);
    }
}

BarcodePicker.prototype.setOrientations = function(orientations) {
	this.orientations = orientations;
	if (this.isShown) {
    	cordova.exec(null, null, "ScanditSDK", "updateOverlay", [{"orientations": orientations}]);
	}
}

BarcodePicker.prototype.setConstraints = function(portrait, landscape, animationDuration) {
	if (portrait == null) {
		this.portraitConstraints = new Constraints();
	} else {
		this.portraitConstraints = portrait
	}
	if (landscape == null) {
		this.landscapeConstraints = new Constraints();
	} else {
		this.landscapeConstraints = landscape
	}
	if (this.isShown) {
		var duration = 0;
		if (typeof animationDuration !== "undefined") {
			duration = parseFloat(animationDuration);
		}
    	cordova.exec(null, null, "ScanditSDK", "resize", [{"portraitConstraints": this.portraitConstraints,
    													   "landscapeConstraints": this.landscapeConstraints,
    													   "animationDuration": duration}]);
	}
}

BarcodePicker.prototype.setMargins = function(portrait, landscape, animationDuration) {
    var portraitConstraints = null;
    var landscapeConstraints = null;

    if (portrait != null) {
		portraitConstraints = new Constraints()
        portraitConstraints.leftMargin = portrait.left;
        portraitConstraints.topMargin = portrait.top;
        portraitConstraints.rightMargin = portrait.right;
        portraitConstraints.bottomMargin = portrait.bottom;
	}
	if (landscape != null) {
        landscapeConstraints = new Constraints();
        landscapeConstraints.leftMargin = landscape.left;
        landscapeConstraints.topMargin = landscape.top;
        landscapeConstraints.rightMargin = landscape.right;
        landscapeConstraints.bottomMargin = landscape.bottom;
	}
    this.setConstraints(portraitConstraints, landscapeConstraints, animationDuration);
}

module.exports = BarcodePicker;
