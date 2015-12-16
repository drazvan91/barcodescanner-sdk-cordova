module.exports = ScanOverlay;


/**
 * @brief Abstract scan UI class
 *
 * The ScanOverlay implements the scan UI displayed on top of the video feed. It is responsible
 * for highlighting barcodes and draw the viewfinder rectangle or laser UI.
 */
function ScanOverlay(picker) {
    this.picker = picker;
    this.properties = {};
}

/**
 * @name Camera Switch Button Visibility
 * @{
 */
 ScanOverlay.CameraSwitchVisibility = {
	/**
	 * @brief The camera switch button is always hidden.
	 */
	NEVER: 0,
	/**
	 * @brief The camera switch button is shown on tablet devices with front and back cameras.
	 */
	ON_TABLET: 1,
	/**
	 * @brief The camera switch button is shown on all devices that have front and back cameras.
	 */
	ALWAYS: 2
}
/**
 * @}
 */


/**
 * @name Scan UI style
 * @{
 */
ScanOverlay.GuiStyle = {
    /**
     * A rectangular viewfinder with rounded corners is shown in the specified size. Recognized
     * codes are marked with four corners.
     */
	DEFAULT: 0,
    /**
     * A laser line is shown with the specified width while the height is not changeable. This mode
     * should generally not be used if the recognition is running on the whole screen as it
     * indicates that the code should be placed at the location of the laser line.
     */
	LASER: 1,
    /**
     * No UI is shown to indicate where the barcode should be placed. Be aware that the Scandit
     * logo continues to be displayed as showing it is part of the license agreement.
     */
	NONE: 2
}
/**
 * @}
 */

/**
 * @brief The GUI style drawn to display the indicator where the code should be scanned and the
 *   visualization of recognized codes.
 *
 * @param guiStyle Must be one of {@link ScanOverlay.GuiStyle.DEFAULT}, {@link ScanOverlay.GuiStyle.LASER} or
 *        {@link ScanOverlay.GuiStyle.NONE}. By default this is ScanOverlay.GuiStyle.DEFAULT.
 *
 * @since 4.11.0
 */
ScanOverlay.prototype.setGuiStyle = function(guiStyle) {
	this.guiStyle = guiStyle;
	this.updateOverlayIfExists();
}


/** @name Sound Configuration
 *  Customize the scan sound.
 */
///@{

/**
 * Enables (or disables) the sound when a barcode is recognized. If the phone's ring mode
 * is set to muted or vibrate, no beep will be played regardless of the value.
 *
 * Enabled by default.
 *
 * @since 4.11.0
 *
 * @param enabled Whether the beep is enabled.
 */
ScanOverlay.prototype.setBeepEnabled = function(enabled) {
    this.beep = enabled;
	this.updateOverlayIfExists();
}

/**
 * Enables or disables the vibration when a code was recognized. If the phone's ring mode
 * is set to muted, no beep will be played regardless of the value.
 *
 * Enabled by default.
 *
 * @since 4.11.0
 *
 * @param enabled Whether vibrate is enabled.
 */
ScanOverlay.prototype.setVibrateEnabled = function(enabled) {
    this.vibrate = enabled;
	this.updateOverlayIfExists();
}
///@}


/** @name Torch Configuration
 *  Enable and customize appearance of the torch icon.
 */
///@{

/**
 * Enables or disables the torch toggle button for all devices/cameras that support a torch.
 *
 * By default it is enabled. The torch icon is never shown when the camera does not have a
 * torch (most tablets, front cameras, etc).
 *
 * @since 4.11.0
 *
 * @param enabled Whether the torch button should be shown.
 */
ScanOverlay.prototype.setTorchEnabled = function(enabled) {
    this.torch = enabled;
	this.updateOverlayIfExists();
}

/**
 * Sets the images which are being drawn when the torch is on.
 *
 * If you want this to be displayed in proper resolution on high resolution screens, you need
 * to provide a resource big enough to work with at least xhdpi resolution.
 *
 * @since 4.11.0
 *
 * @param image The new image for when the torch is on.
 * @param pressedImage The new image for when the torch is on and it is pressed.
 */
ScanOverlay.prototype.setTorchOnImage = function(image, pressedImage) {
    
}

/**
 * Sets the images which are being drawn when the torch is off.
 *
 * If you want this to be displayed in proper resolution on high resolution screens, you need
 * to provide a resource big enough to work with at least xhdpi resolution.
 *
 * @since 4.11.0
 *
 * @param image The new image for when the torch is off.
 * @param pressedImage The new image for when the torch is off and it is pressed.
 */
ScanOverlay.prototype.setTorchOffImage = function(image, pressedImage) {
    
}

/**
 * @brief Sets the position at which the button to enable the torch is drawn.
 *
 * By default the margins are 15 and width and height are 40.
 *
 * @since 4.7.0
 *
 * @param leftMargin Left margin in points.
 * @param topMargin Top margin in points.
 * @param width Width in points.
 * @param height Height in points.
 */
ScanOverlay.prototype.setTorchButtonMarginsAndSize = function(leftMargin, topMargin, width, height) {
    this.torchButtonMarginsAndSize = [leftMargin, topMargin, width, height];
	this.updateOverlayIfExists();
}

/**
 * @brief Sets the accessibility label and hint for the torch button while the torch is off.
 *
 * The accessibility label and hint give vision-impaired users voice over guidance for the torch
 * button while the torch is turned on. The default label is "Torch Switch (Currently Off)", the
 * default hint "Double-tap to switch the torch on". The hint is only set on iOS devices as Android 
 * does not support it.
 *
 * @since 4.11.0
 *
 * @param label The accessibility label.
 * @param hint The accessibility hint.
 */
ScanOverlay.prototype.setTorchButtonOffAccessibility = function(label, hint) {
    this.torchButtonOffAccessibilityLabel = label;
    this.torchButtonOffAccessibilityHint = hint;
	this.updateOverlayIfExists();
}

/**
 * @brief Sets the accessibility label and hint for the torch button while the torch is on.
 *
 * The accessibility label and hint give vision-impaired users voice over guidance for the torch
 * button while the torch is turned on. The default label is "Torch Switch (Currently On)", the
 * default hint "Double-tap to switch the torch off". The hint is only set on iOS devices as Android 
 * does not support it.
 *
 * @since 4.11.0
 *
 * @param label The accessibility label.
 * @param hint The accessibility hint.
 */
ScanOverlay.prototype.setTorchButtonOnAccessibility = function(label, hint) {
    this.torchButtonOnAccessibilityLabel = label;
    this.torchButtonOnAccessibilityHint = hint;
	this.updateOverlayIfExists();
}
///@}


/** @name Camera Switch Configuration
 *  Enable camera switch and set icons
 */
///@{

/**
 * Sets when the camera switch button is visible for devices that have more than one camera.
 *
 * By default it is CAMERA_SWITCH_NEVER.
 *
 * @since 4.11.0
 *
 * @param visibility The visibility of the camera switch button (.CAMERA_SWITCH_NEVER,
 *                   CAMERA_SWITCH_ON_TABLET, CAMERA_SWITCH_ALWAYS)
 */
ScanOverlay.prototype.setCameraSwitchVisibility = function(visibility) {
    this.cameraSwitchVisibility = visibility;
	this.updateOverlayIfExists();
}

/**
 * Sets the images which are being drawn when the camera switch button is visible.
 *
 * If you want this to be displayed in proper resolution on high resolution screens, you need to
 * also provide a resource with the same name but @2x appended and in higher resolution (like
 * flashlight-turn-on-icon@2x.png).
 *
 * File needs to be placed in Resources folder.
 *
 * By default this is: "camera-swap-icon.png" and "camera-swap-icon-pressed.png"
 *
 * @since 4.11.0
 *
 * @param image The new image for the camera swap button.
 * @param pressedImage The new image for the camera swap button when it is pressed.
 */
ScanOverlay.prototype.setCameraSwitchImage = function(image, pressedImage) {
    
}

/**
 * @brief Sets the position at which the button to switch the camera is drawn.
 *
 * By default the margins are 15 and width and height are 40.
 *
 * @since 4.11.0
 *
 * @param rightMargin Right margin in dp.
 * @param topMargin Top margin in dp.
 * @param width Width in dp.
 * @param height Height in dp.
 */
ScanOverlay.prototype.setCameraSwitchButtonMarginsAndSize = function(rightMargin, topMargin, width, height) {
    this.cameraSwitchButtonMarginsAndSize = [rightMargin, topMargin, width, height];
	this.updateOverlayIfExists();
}

/**
 * @brief Sets the accessibility label and hint for the camera switch button while the back-facing
 * camera is active.
 *
 * The accessibility label and hint give vision-impaired users voice over guidance for the camera
 * switch button while the back-facing camera is active. The default label is "Camera Switch 
 * (Currently back-facing)", the default hint "Double-tap to switch to the front-facing camera".
 * The hint is only set on iOS devices as Android does not support it.
 *
 * @since 4.11.0
 *
 * @param label The accessibility label.
 * @param hint The accessibility hint.
 */
ScanOverlay.prototype.setCameraSwitchButtonBackAccessibility = function(label, hint) {
    this.cameraSwitchButtonBackAccessibilityLabel = label;
    this.cameraSwitchButtonBackAccessibilityHint = hint;
	this.updateOverlayIfExists();
}

/**
 * @brief Sets the accessibility label and hint for the camera switch button while the front-facing
 * camera is active.
 *
 * The accessibility label and hint give vision-impaired users voice over guidance for the camera
 * switch button while the front-facing camera is active. The default label is "Camera Switch 
 * (Currently front-facing)", the default hint "Double-tap to switch to the back-facing camera".
 * The hint is only set on iOS devices as Android does not support it.
 *
 * @since 4.11.0
 *
 * @param label The accessibility label.
 * @param hint The accessibility hint.
 */
ScanOverlay.prototype.setCameraSwitchButtonFrontAccessibility = function(label, hint) {
    this.cameraSwitchButtonFrontAccessibilityLabel = label;
    this.cameraSwitchButtonFrontAccessibilityHint = hint;
	this.updateOverlayIfExists();
}
///@}

/** @name Viewfinder Configuration
 *  Customize the viewfinder where the barcode location is highlighted.
 */
///@{

/**
 * Sets the size of the viewfinder relative to the size of the screen size.
 *
 * Changing this value does not(!) affect the area in which barcodes are successfully
 * recognized. It only changes the size of the box drawn onto the scan screen. To restrict the
 * active scanning area, use the methods listed below.
 *
 * @see ScanSettings.enableRestrictedAreaScanning(boolean)
 * @see ScanSettings.setScanningHotSpot(float, float)
 * @see ScanSettings.setScanningHotSpotHeight(float)
 *
 * By default the width is 0.8, height is 0.4, landscapeWidth is 0.6, landscapeHeight is 0.4
 *
 * @since 4.11.0
 *
 * @param width Width of the viewfinder rectangle in portrait orientation.
 * @param height Height of the viewfinder rectangle in portrait orientation.
 * @param landscapeWidth Width of the viewfinder rectangle in landscape orientation.
 * @param landscapeHeight Height of the viewfinder rectangle in landscape orientation.
 */
ScanOverlay.prototype.setViewfinderDimension = function(width, height, landscapeWidth, landscapeHeight) {
    this.viewfinderDimension = [width, height, landscapeWidth, landscapeHeight];
	this.updateOverlayIfExists();
}

/**
 * Sets the color of the viewfinder before a bar code has been recognized
 *
 * Note: This feature is only available with the Scandit SDK Enterprise Packages.
 *
 * By default this is: white (1.0, 1.0, 1.0)
 *
 * @since 4.11.0
 *
 * @param r Red component (between 0.0 and 1.0).
 * @param g Green component (between 0.0 and 1.0).
 * @param b Blue component (between 0.0 and 1.0).
 */
ScanOverlay.prototype.setViewfinderColor = function(r, g, b) {
    this.viewfinderColor = [r, g, b];
	this.updateOverlayIfExists();
}

/**
 * Sets the color of the viewfinder once the bar code has been recognized.
 * <p>
 * Note: This feature is only available with the Scandit SDK Enterprise Packages.
 *
 * By default this is: light blue (0.222, 0.753, 0.8)
 *
 * @since 4.11.0
 *
 * @param r Red component (between 0.0 and 1.0).
 * @param g Green component (between 0.0 and 1.0).
 * @param b Blue component (between 0.0 and 1.0).
 */
ScanOverlay.prototype.setViewfinderDecodedColor = function(r, g, b) {
    this.viewfinderDecodedColor = [r, g, b];
	this.updateOverlayIfExists();
}
///@}


/** @name Search Bar Configuration
 *  Customize the search bar.
 */
///@{
ScanOverlay.prototype.showSearchBar(show) {
	this.searchBar = show;
	this.updateOverlayIfExists();
}

ScanOverlay.prototype.setSearchBarActionButtonCaption(caption) {
	this.searchBarActionButtonCaption = caption;
	this.updateOverlayIfExists();
}

ScanOverlay.prototype.setSearchBarCancelButtonCaption(caption) {
	this.searchBarCancelButtonCaption = caption;
	this.updateOverlayIfExists();
}

ScanOverlay.prototype.setSearchBarPlaceholderText(text) {
	this.searchBarPlaceholderText = text;
	this.updateOverlayIfExists();
}

ScanOverlay.prototype.setMinSearchBarBarcodeLength(length) {
	this.minSearchBarBarcodeLength = length;
	this.updateOverlayIfExists();
}

ScanOverlay.prototype.setMaxSearchBarBarcodeLength(length) {
	this.maxSearchBarBarcodeLength = length;
	this.updateOverlayIfExists();
}
///@}

/** @name Non-Official Methods
 */
///@{
/**
 * Set custom property
 *
 * This function is for internal use/and or experimental features and any functionality that
 * can be accessed through it can and will vanish without public notice from one version to
 * the next. Do not use this method unless you specifically have to.
 *
 * @param key The name of the property
 * @param value the value for the property.
 */
ScanOverlay.prototype.setProperty = function(key, value) {
    this.properties[key] = value;
	this.updateOverlayIfExists();
}
///@}

ScanOverlay.prototype.updateOverlayIfExists = function() {
	if (this.picker.isShown) {
		cordova.exec(null, null, "ScanditSDK", "updateOverlay", [this]);
	}
}

    