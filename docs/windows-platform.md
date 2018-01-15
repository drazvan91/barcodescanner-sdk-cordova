Windows Platform Guide {#cordova-windows}
=========================

This guide covers aspects that are specific to the windows plugin. 

Supported Features
----------------------------------------------------

In contrast to other platforms, the Cordova/Phonegap plugin on windows can't be based on the native picker implementation. Instead, the Cordova/Phonegap plugin is a completely separate picker implementation. It currently doesn't support all the features of the native picker. For a list of supported features, take a look at \ref cordova-features-by-platform

Building
----------------------------------------------------

The Phonegap/Cordova plugin for the windows platform supports applications targeting Windows 8.1, Windows Phone 8.1 and Universal Windows 10. Since the barcode scanner plugin uses platform-dependent code, it is not possible to build with the "Any CPU" target. Instead, select a specific architecture, e.g. x86, x64 or ARM for building.

Supported Cordova Versions
--------------------------------------------------

The Scandit BarcodeScanner requires the Cordova Windows platform version 5.0.0 or newer. Previous releases of the Cordova Windows platform (i.e. 4.3.1) are missing some of the functionality required to install the Scandit BarcodeScanner plugin. More specifically, it is not possible to have one plugin that targets multiple architectures or operating systems when the plugin depends on unmanaged C/C++ code. Modyfying the plugin by hand is the only workaround.

Cordova Windows 5.0 or later
------------------------------------------------------------------------------------

Setup your app as follows:

~~~~~~~~~~~~~~~~{.java}
cordova create myapp --id "com.scandit.sample"
cd myapp
cordova platform add windows
cordova plugin add ..\path\to\unzipped-barcode-scanner-plugin --nofetch
~~~~~~~~~~~~~~~~
Starting from cordova 7.0, the cordova windows version installed by default is recent enough to support the Scandit plugin. If you are on an older cordova version, you can update the cordova windows platform using the following command:

~~~~~~~~~~~~~~~~{.java}
cordova platform update windows@5.0.0 
~~~~~~~~~~~~~~~~

Cordova Windows 4.3: Modify plugin.xml by hand (not recommended)
-----------------------------------------------------------------------------------

Alternatively, if you are unable to use the latest Cordova platform, you can modify the plugin.xml file to only target one particular OS with one particular architecture by hand.

The following instructions show how to modify the plugin.xml to target Windows Phone 8.1 with ARM. If you are targeting another OS version/architecture, proceed in similar fashion.

1. Open plugin.xml
2. Scroll to the windows platform section (`<platform name="windows">`). This section contains 6 resource-file elements. Each of them is responsible for adding one unmanaged C/C++ dll to the application. You will now need to remove the resource-file elements that do not match your OS, so in the case of Windows Phone 8.1 you need to keep the resource-file elements with `device-target="phone"` and `versions="8.1"`, but remove the others.

3. There are now two remaining resource-file elements. These elements have platform placeholder in the src name. Replace $(Platform) with the actual name of the architecture you are using. In our case ARM.

4. Now you are done and can install the plugin as you normally would.

If you follow this approach, use Cordova windows platform 4.3.1 or newer. For older platform versions, including 4.3.0, some of the functionality we require is either not available or doesn't work for some of the project files.


Building the Application
----------------------------------------------------------------------------------

Because the Scandit Barcodescanner plugin relies on native code, you will need to select a specific architecture when building your application. It is not possible to build for "Any CPU". When building for phone, make sure to select the ARM architecture. When building from the command-line, this can be done with the following command:

    cordova build windows --archs arm -- -phone

Likewise, when building for a x86-based tablet or a Windows PC, you can use the following command to build:

    cordova build windows --archs x86 -- -win

