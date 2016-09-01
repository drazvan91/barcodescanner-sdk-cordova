(function (exports) {

    exports.loadTabHome = function ($scope) {
	if ($scope.ready) {
	    $scope.stopPicker();
	} else {
	    document.addEventListener('deviceready', $scope.stopPicker);
	}

        $scope.setMargin("0%", "0%", "0%", "50%");
        $scope.setLandscapeMargin("0%", "0%", "0%", "50%");
        var scanResults = document.getElementById('scanResults');
        $scope.setCallback(function (session, manual) {
           $scope.pausePicker();
           if (manual) {
               var code = session;
               $scope.$apply(function () {
                   $scope.scannedCode = 'Manual entry: ' + code;
               });
           } else {
               var result = '';
               for (var i = 0; i < session.newlyRecognizedCodes.length; ++i) {
                    var code = session.newlyRecognizedCodes[i];
                    if (i > 0) {
                        result += ', ';
                    }
                    result += '(' + code.symbology.toUpperCase() + ') ' + code.data;
               }
               $scope.$apply(function () {
                   $scope.scannedCode = result;
               });
            }
        });
        var setActiveScanningArea = function(settings) {
            settings.activeScanningAreaPortrait = new Scandit.Rect(0.0, 0.25, 1.0, 0.5);
            settings.activeScanningAreaLandscape = new Scandit.Rect(0.0, 0.25, 1.0, 0.5);
        };
        if ($scope.ready) {
           $scope.startPicker(setActiveScanningArea);
       } else {
            document.addEventListener('deviceready', function() {
                $scope.startPicker(setActiveScanningArea);
            });
       }
    }
})(this);
