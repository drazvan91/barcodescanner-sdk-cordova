Update to Scandit Barcode Scanner Plugin 4.11 {#cordova-update-4_11}
===================================

## What's new?

In version 4.11 of the Scandit Barcode Scanner Phonegap plugin a new API is exposed which has been available in the native iOS and Android version since 4.7 and 4.3 respectively. Additionally to exposing new functionality 4.11 also introduces a javascript wrapper that eliminates the rather ugly call to cordova.exec. 

When updating from a version prior to 4.11, you have two options:

* continue to use the cordova.exec calls that were available already before 4.11. Improvements to the barcode recognition engine (performance, recognition rates) will also be available when using the old cordova.exec calls. However, new features that require additions to the API will only be added to the new javascript api. Thus if you need any of these new features, you will have to update to use the new classes.

* upgrade to the new Scandit.BarcodePicker API (see below).

## Updating from cordova.exec to Scandit.BarcodePicker

This section highlights the concepts of the {@link Scandit.BarcodePicker Scandit.BarcodePicker} API and shows how to upgrade existing code.

### Barcode Picker

The {@link Scandit.BarcodePicker BarcodePicker} is the object that connects you to the actual recognition. This is where you show the UI and start/stop the recognition.

### Scan Settings

The cordova.exec call contained methods to configure the scanning behavior, e.g. hot spot, enable symbologies, scanning area etc. In the {@link Scandit.BarcodePicker BarcodePicker} these methods no longer exist. Instead the barcode scanner is now configured through a {@link Scandit.ScanSettings ScanSettings} instance. The scan settings instance allows you to configure the enabled symbologies and other scanning-related options. The settings do not immediately take effect, but only after applying them to the barcode picker, either when the picker is constructed, or through {@link Scandit.BarcodePicker.applyScanSettings(settings) BarcodePicker.applyScanSettings(settings)}.

### New Callbacks

The success callback has been reworked and is called with a {@link Scandit.ScanSession ScanSession} as the argument instead of the barcode content and symbology. You now have to access the recognized codes through {@link Scandit.ScanSession.newlyRecognizedCodes ScanSession.newlyRecognizedCodes}. It's guaranteed that there is at least one new code available when the success callback gets called. Additionally the search bar has its own callback receiving only the content entered as the argument.

### Other changes

- For the new API, the default length of barcodes  has been lowered for all variable-length symbologies (Code 39, Code 93, Code 128, Codabar, Interleaved 2 of 5, MSI-Plessey).  To scan codes that are longer than the new defaults, you must explicitly enable scanning of longer codes. Take a look at the {@link Scandit.SymbologySettings.activeSymbolCounts SymbologySettings.activeSymbolCounts} documentation for details on how to do that.


