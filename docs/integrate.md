Integrate the Scandit Barcode Scanner plugin into your app     {#cordova-integrate}
===================================

To integrate the Scandit Barcode Scanner into your Phonegap app, follow the simple steps below.
 
## Get the Scandit Barcode Scanner SDK

Choose a plan (e.g., free “Enterprise” or "Community" plan) at http://www.scandit.com/pricing and download the Scandit Barcode Scanner SDK for Android from your account.
<br/>
![Download page](img/cordova/DownloadPage.png)
<br/>


## Create a new project

If you do not have a Phonegap project yet, you should create a new one.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    cordova create helloworld
    cd helloworld
    cordova platform add ios
    cordova platform add android
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


## Add the plugin to your project

Use the phonegap CLI to add the plugin to your already existing project.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    cd <directory of your project>
	phonegap plugin add <path to downloaded and unzipped plugin>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


### Instantiate and configure the barcode picker

The scanning process is managed by the {@link Scandit.BarcodePicker BarcodePicker}. Before instantiating the picker, you will have to set your Scandit Barcode Scanner application key. The key is available from your Scandit Barcode Scanner SDK account at http://account.scandit.com in the downloads section. The barcode scanning is configured through an instance of scan settings that you pass to the BarcodePicker constructor. 

~~~~~~~~~~~~~~~~{.java}

// Set your app key
Scandit.License.setAppKey("--- ENTER YOUR SCANDIT APP KEY HERE ---");

var settings = Scandit.ScanSettings();
settings.setSymbologyEnabled(Scandit.Barcode.Symbology.EAN13, true);
settings.setSymbologyEnabled(Scandit.Barcode.Symbology.UPCA, true);

// Instantiate the barcode picker by using the settings defined above.
var picker = new Scandit.BarcodePicker(settings);

~~~~~~~~~~~~~~~~

<br/>

### Show the scan UI

Show the scanner to the user through {@link Scandit.BarcodePicker.show(success, manual, failure) show(success, manual, failure)}. You can pass it three callback functions, one for when a barcode is recognized, one for when a code was manually entered and one for when the scan process was canceled by the user.

~~~~~~~~~~~~~~~~{.java}

picker.show(success, null, failure);

~~~~~~~~~~~~~~~~

For more information on the different ways to add the barcode picker to your view hierarchy, consult \ref android-scanview-options.
<br/>

### Create the callback functions 

Start the actual scanning process to start the camera and look for codes.

~~~~~~~~~~~~~~~~{.java}

picker.startScanning();

~~~~~~~~~~~~~~~~

<br/>

### Start the scanner 

Start the actual scanning process to start the camera and look for codes.

~~~~~~~~~~~~~~~~{.java}

picker.startScanning();

~~~~~~~~~~~~~~~~

<br/>

## Run the project

Run your app on your Android device. 

<br/>

## Next steps

* \ref cordova-cropped-or-scaled-picker
* \ref cordova-restrict-scanning-area

