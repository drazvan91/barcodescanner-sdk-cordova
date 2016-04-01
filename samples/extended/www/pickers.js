(function (exports) {
    exports.loadTabPickers = function ($scope) {
        $scope.scannedCode = '';
        if ($scope.ready) {
            $scope.stopPicker();
        } else {
            document.addEventListener('deviceready', $scope.stopPicker);
        }
        var pickers = document.getElementById("pickerchoices");
        pickers.children[0].onclick = function () { customPicker(0, 0, 0, 0); };
        pickers.children[1].onclick = function () { customPicker(40, 40, 40, 40); };
        pickers.children[2].onclick = function () { customPicker(40, 0, 40, 0); };
        pickers.children[3].onclick = function () { customPicker(1, 60, 1, 60); };
    }

    exports.pickerOpen = false;
    exports.canClose = false;

    exports.customPicker = function (marginLeft, marginTop, marginRight, marginBottom) {
        if (pickerOpen) {
	    return;
	}
        var scope = angular.element(document.body).scope();
        scope.$apply(function () {
            scope.setMargin(marginLeft, marginTop, marginRight, marginBottom);
            scope.setLandscapeMargin(marginLeft, marginTop, marginRight, marginBottom);
            scope.startPicker();

            scope.setCallback(function (session, manual) {
                if (manual) {
                    scope.scannedCode = session;
                } else {
                    var code = session.newlyRecognizedCodes[0];
                    scope.scannedCode = '(' + code.symbology.toUpperCase() + ') ' + code.data;
                }
                scope.stopPicker();
                scope.$digest();
            });
        });
	
	if (marginLeft > 0 || marginTop > 0 || marginRight > 0 || marginBottom > 0) {
	    pickerOpen = true;
            var buttons = document.getElementById("pickerchoices");
            for (i = 0; i < buttons.length; i++) {
                buttons[i].disabled = true;
            }
	    setTimeout(function(){canClose = true}, 2000);
	}
    }

    exports.hide = function () {
	if(canClose) {
	    var scope = angular.element(document.body).scope();
            scope.$apply(function () {
                scope.stopPicker();
	    });
	    pickerOpen = false;
	    canClose = false;
	}
    }
})(this);
