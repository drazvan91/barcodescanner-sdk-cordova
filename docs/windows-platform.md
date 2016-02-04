Windows Platform Guide {#cordova-windows}
=========================

This guide covers aspects that are specific to the windows plugin. 

Supported Features
----------------------------------------------------

In contrast to other platforms, the cordova/phonegap plugin on windows can't be based on the native picker implementation. Instead, the cordova/phonegap plugin is a completely separate picker implementation. It currently doesn't support all the features of the native picker. For a list of supported features, take a look at \ref cordova-features-by-platform

Building
----------------------------------------------------

The phonegap/cordova plugin for the windows platform supports applications targeting Windows 8.1, Windows Phone 8.1 and Universal Windows 10.  Since the barcode scanner plugin uses platform-dependent code, it is not possible to build with the "Any CPU" target. Instead, select a specific architecture, e.g. x86, x64 or ARM for building. 

Supported Cordova Versions
--------------------------------------------------

As of the Scandit BarcodeScanner release 4.12.0, the last stable release of the cordova windows platform (4.3.1) is missing some of the functionality required to install the Scandit BarcodeScanner plugin. More specifically, it is not possible to have one plugin that targets multiple architectures or operating systems when the plugin depends on unmanaged C/C++ code. These issues will be fixed in the upcoming release of cordova-windows. As soon as this version is released, these steps will no longer be necessary. 

In the meantime, to install the plugin as is, you will either need to use the pre-release version of cordova-windows, or modify the plugin.xml included with the barcode scanner plugin by hand. We recommend to use the pre-release version of cordova-windows as this is the simpler approach.

Install pre-release version of cordova-windows (recommended)
------------------------------------------------------------------------------------

Instead of installing the windows platform with `cordova platform add windows`, you need to clone the cordova-windows repository from Github and add the platform from the local working copy of the platform. 


~~~~~~~~~~~~~~~~{.java}
git clone https://github.com/apache/cordova-windows
cordova create myapp
cd myapp
cordova platform add ..\cordova-windows
cordova plugin add ..\path\to\unzipped-barcode-scanner-plugin
~~~~~~~~~~~~~~~~

Alternative: modify plugin.xml by hand (not recommended)
-----------------------------------------------------------------------------------

Alternatively, if you don't feel comfortable to use an unreleased cordova platform, e.g. if you want to use the plugin in production, you can modify the plugin.xml file to only target one particular OS with one particular architecture by hand.

The following instructions show how to modify the plugin.xml to target Windows Phone 8.1 with ARM. If you are targeting another OS version/architecture, proceed in similar fashion.

1. Open plugin.xml
2. Scroll to the windows platform section (`<platform name="windows">`). This section contains 6 resource-file elements. Each of them is responsible for adding one unmanaged C/C++ dll to the application. You will now need to remove the resource-file elements that do not match your OS, so in the case of Windows Phone 8.1 you need to keep the resource-file elements with `device-target="phone"` and `versions="8.1"`, but remove the others.

3. There are now two remaining resource-file elements. These elements have platform placeholder in the src name. Replace $(Platform) with the actual name of the architecture you are using. In our case ARM.

4. Now you are done and can install the plugin as you normally would.

If you follow this approach, use cordova windows platform 4.3.1 or newer. For older platform versions, including 4.3.0, some of the functionality we require is either not available or doesn't work for some of the project files.

