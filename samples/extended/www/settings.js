(function (exports) {
    var app = angular.module('app');
    var symbologies = {
        ean13upca: { ids: ['ean13', 'upca'], enabled: true },
        ean8: { ids: ['ean8'], enabled: true },
        upce: { ids: ['upce'], enabled: true },
        two_digit_add_on: { ids: ['two-digit-add-on'], enabled: false },
        five_digit_add_on: { ids: ['five-digit-add-on'], enabled: false },
        code11: { ids: ['code11'], enabled: false },
        code25: { ids: ['code25'], enabled: false },
        code39: { ids: ['code39'], enabled: true },
        code93: { ids: ['code93'], enabled: false },
        code128: { ids: ['code128'], enabled: true },
        itf: { ids: ['itf'], enabled: true },
        msi_plessey: { ids: ['msi-plessey'], enabled: false },
        databar: { ids: ['databar'], enabled: false },
        databar_limited: { ids: ['databar-limited'], enabled: false },
        databar_expanded: { ids: ['databar-expanded'], enabled: false },
        codabar: { ids: ['codabar'], enabled: false },
        qr: { ids: ['qr'], enabled: true },
        data_matrix: { ids: ['data-matrix'], enabled: true },
        pdf417: { ids: ['pdf417'], enabled: false },
        micropdf417: { ids: ['micropdf417'], enabled: false },
        aztec: { ids: ['aztec'], enabled: false },
        maxicode: { ids: ['maxicode'], enabled: false },
        kix: { ids: ['kix'], enabled: false },
        rm4scc: { ids: ['rm4scc'], enabled: false }
    };
    var recognition_options = {
        msi_plessey_checksum: "mod10",
        qr_inverted: false,
        data_matrix_inverted: false,
        restrict_scanning_area: true,
        hotspot_width: 1.0,
        hotspot_height: 0.5,
        hotspot_y: 0.5,
    }
    var ui = {
        beep: true,
        vibrate: true,
        style: 'default',
        searchBar: false,
        torch: true,
        torch_xmargin: 15,
        torch_ymargin: 15,
        cameraSwitch: 'never',
        cameraSwitch_xmargin: 15,
        cameraSwitch_ymargin: 15,
        viewfinder_width: 0.8,
        viewfinder_height: 0.4,
        viewfinderLandscape_width: 0.6,
        viewfinderLandscape_height: 0.4
    };

    if ((localStorage.ui !== null) && (localStorage.ui !== undefined)) {
        var list = JSON.parse(localStorage.ui);
        for (i in ui) {
            if (list[i] !== null && list[i] !== undefined) {
	        if (typeof ui[i] === typeof list[i]) {
                    ui[i] = list[i];
		        }
            }
        }
    }
    if ((localStorage.symbologies !== null) && (localStorage.symbologies !== undefined)) {
        list = JSON.parse(localStorage.symbologies);
        for (sym in symbologies) {
            if (list[sym] !== null && list[sym] !== undefined) {
                symbologies[sym] = list[sym];
            }
        }
    }
    if ((localStorage.recognition_options !== null) && (localStorage.recognition_options !== undefined)) {
        list = JSON.parse(localStorage.recognition_options);
        for (option in recognition_options) {
            if (list[option] !== null && list[option] !== undefined) {
	        if (typeof recognition_options[option] === typeof list[option]) {
                    recognition_options[option] = list[option];
		        }
            }
        }
    }

    app.controller("SettingsController", function ($scope) {
        $scope.symbologies = symbologies;
        $scope.recognition_options = recognition_options;
        $scope.ui = ui;
        $scope.saveSettings = function () {
            localStorage.setItem("ui", JSON.stringify($scope.ui));
            localStorage.setItem("symbologies", JSON.stringify($scope.symbologies));
            localStorage.setItem("recognition_options", JSON.stringify($scope.recognition_options));
        }
    });

    exports.getScanSettings = function () {
        var scanSettings = new Scandit.ScanSettings();
        for (sym in symbologies) {
            if (symbologies[sym].ids !== null && symbologies[sym].ids !== undefined
                    && symbologies[sym].enabled !== null && symbologies[sym].enabled !== undefined) {
                symbologies[sym].ids.forEach(function (id) {
                    scanSettings.setSymbologyEnabled(id, symbologies[sym].enabled);
                });
            }
        }
        if (scanSettings.symbologies['two-digit-add-on'].enabled ||
            scanSettings.symbologies['five-digit-add-on'].enabled) {
            scanSettings.maxNumberOfCodesPerFrame = 2;
        }

        var msi_checksums = [Scandit.SymbologySettings.Checksum.MOD_10];
        if (recognition_options.msi_plessey_checksum === 'none') {
            msi_checksums = [];
        } else if (recognition_options.msi_plessey_checksum === 'mod11') {
            msi_checksums = [Scandit.SymbologySettings.Checksum.MOD_11];
        } else if (recognition_options.msi_plessey_checksum === 'mod1010') {
            msi_checksums = [Scandit.SymbologySettings.Checksum.MOD_1010];
        } else if (recognition_options.msi_plessey_checksum === 'mod1110') {
            msi_checksums = [Scandit.SymbologySettings.Checksum.MOD_1110];
        }
        scanSettings.symbologies['msi-plessey'].checksums = msi_checksums;

        scanSettings.symbologies['qr'].colorInvertedEnabled = recognition_options.qr_inverted;
        scanSettings.symbologies['data-matrix'].colorInvertedEnabled = recognition_options.data_matrix_inverted;

		if (recognition_options.restrict_scanning_area) {
			var hotSpotY = recognition_options.hotspot_y;
			var height = recognition_options.hotspot_height;
			var width = recognition_options.hotspot_width;

			var restricted = new Scandit.Rect(0.5 - width * 0.5, hotSpotY - 0.5 * height, width, height);
            scanSettings.scanningHotSpot = new Scandit.Point(0.5, hotSpotY);
			scanSettings.activeScanningAreaPortrait = restricted;
			scanSettings.activeScanningAreaLandscape = restricted;
		}

        return scanSettings;
    };

    exports.applyUISettings = function (picker) {
        var overlay = picker.getOverlayView();
        overlay.setBeepEnabled(ui.beep);
        overlay.setVibrateEnabled(ui.vibrate);
        overlay.showSearchBar(ui.searchBar);
        if (ui.searchBar) {
            overlay.setSearchBarPlaceholderText("Manual barcode data entry");
        }
        overlay.setTorchEnabled(ui.torch);
        overlay.setTorchButtonMarginsAndSize(parseInt(ui.torch_xmargin),
                                             parseInt(ui.torch_ymargin), 40, 40);
        overlay.setCameraSwitchVisibility(ui.torch);
        overlay.setCameraSwitchButtonMarginsAndSize(parseInt(ui.cameraSwitch_xmargin),
                                                    parseInt(ui.cameraSwitch_ymargin), 40, 40);
        overlay.setViewfinderDimension(parseFloat(ui.viewfinder_width),
                        parseFloat(ui.viewfinder_height),
                        parseFloat(ui.viewfinderLandscape_width),
                        parseFloat(ui.viewfinderLandscape_height));
        if (ui.cameraSwitch === 'always') {
            overlay.setCameraSwitchVisibility(Scandit.ScanOverlay.CameraSwitchVisibility.ALWAYS);
        } else if (ui.cameraSwitch === 'tablet') {
            overlay.setCameraSwitchVisibility(Scandit.ScanOverlay.CameraSwitchVisibility.ON_TABLET);
        } else if (ui.cameraSwitch === 'never') {
            overlay.setCameraSwitchVisibility(Scandit.ScanOverlay.CameraSwitchVisibility.NEVER);
        }
        if (ui.style === 'default') {
            overlay.setGuiStyle(Scandit.ScanOverlay.GuiStyle.DEFAULT);
        } else if (ui.style === 'laser') {
            overlay.setGuiStyle(Scandit.ScanOverlay.GuiStyle.LASER);
        } else {
            overlay.setGuiStyle(Scandit.ScanOverlay.GuiStyle.NONE);
        }
    }

    exports.loadTabSettings = function ($scope) {
        if ($scope.ready) {
            $scope.stopPicker();
        } else {
            document.addEventListener('deviceready', $scope.stopPicker);
        }
    }

})(this);
