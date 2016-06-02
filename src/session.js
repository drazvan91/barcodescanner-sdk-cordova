
function ScanSession(newlyRecognizedCodes, newlyLocalizedCodes, allRecognizedCodes, picker) {
	this.newlyRecognizedCodes = newlyRecognizedCodes;
	this.newlyLocalizedCodes = newlyLocalizedCodes;
	this.allRecognizedCodes = allRecognizedCodes;
	this.picker = picker;
}

ScanSession.prototype.stopScanning = function() {
    this.picker.stopScanning();
}

ScanSession.prototype.pauseScanning = function() {
    this.picker.pauseScanning();
}

module.exports = ScanSession;
