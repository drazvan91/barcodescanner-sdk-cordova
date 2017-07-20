
function MatrixScanSession(newlyTrackedCodes) {
	this.newlyTrackedCodes = newlyTrackedCodes;
	this.rejectedTrackedCode = [];
}

MatrixScanSession.prototype.rejectTrackedCode = function(code) {
	this.rejectedTrackedCode.push(code.uniqueId);
}

module.exports = MatrixScanSession;
