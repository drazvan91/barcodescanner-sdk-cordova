
Restricting the Area Where Barcodes are Scanned {#cordova-restrict-scanning-area}
=========================================================================

By default the Scandit Barcode Scanner searches the entire camera feed for barcodes. Under certain conditions it is helpful to restrict the area in which barcodes are recognized, for example if

* you only show a part of the barcode picker, codes that are not visible should generally not be recognized.

* there are multiple barcodes close together and the user has to be able to select a specific one.


## Restrict the scanning area

Restricting the scanning area is done through \link com.scandit.barcodepicker.ScanSettings.setActiveScanningArea(int, RectF) setActiveScanningArea(int, RectF) \endlink on the settings object. You have to provide an orientation (either portrait or landscape) when setting it which allows you to have different scanning areas dependent on the device orientation. The area itself is specified as a rectangle with coordinates relative to the device's screen size where the top-left corner is 0/0 and the bottom-right corner is 1/1. Setting RectF(0.0, 0.0, 1.0, 1.0) would set the scanning area to the entire screen. Following an example of restricting the scanning area to 100% of the screen width and 10% of the screen height centered around the middle of the screen.

~~~~~~~~~~~~~~~~{.java}

ScanSettings settings = ScanSettings.create();

settings.setActiveScanningArea(ScanSettings.ORIENTATION_PORTRAIT, new RectF(0.0f, 0.45f, 0.55f, 1.0f));

~~~~~~~~~~~~~~~~

Restricting the scanning area to only the bottom half of the screen would look the following way:

~~~~~~~~~~~~~~~~{.java}

settings.setActiveScanningArea(ScanSettings.ORIENTATION_PORTRAIT, new RectF(0.0f, 0.5f, 1.0f, 1.0f));

~~~~~~~~~~~~~~~~
<br/>
**Careful:** RectF is defined through left, top, right and bottom coordinates which is different from how the iOS CGRect is defined.
<br/>


## Adjust the viewfinder to match the scanning area

If you reduced the size of the scanning area you likely also want to adjust the size of the viewfinder that guides the user. You can do this by setting the viewfinder dimension on the \link com.scandit.barcodepicker.ScanOverlay ScanOverlay \endlink. The coordinate system here is the same as when setting the active scanning area, relative to the device's screen going from 0.0 to 1.0.

~~~~~~~~~~~~~~~~{.java}

mPicker.getOverlayView().setViewfinderDimension(0.6f, 0.1f, 0.6f, 0.1f);

~~~~~~~~~~~~~~~~

Alternatively you can also use the new laser GUI style. This style is mostly for cases where the scanning area is restricted to a relatively low height (around 10% to 20%) as it guides the user to place the code along the laser line.

~~~~~~~~~~~~~~~~{.java}

mPicker.getOverlayController().setGuiStyle(ScanOverlay.GUI_STYLE_LASER);

~~~~~~~~~~~~~~~~

<br/>
