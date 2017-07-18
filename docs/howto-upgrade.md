
How to upgrade the Scandit Barcode Scanner SDK {#cordova-howto-upgrade}
===================================


## How to upgrade from a test to a production Scandit Barcode Scanner SDK edition

If you upgrade from the test to one of the enterprise or professional editions you only need to replace the license key to enterprise/professional edition. Please contact us for more details.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    cd <directory of your project>
	phonegap plugin rm com.mirasense.scanditsdk.plugin
	phonegap plugin add <path to downloaded and unzipped plugin>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Finally check that the license key of your enterprise account matches the one in your app. If it doesn't match, replace it with the one in your account.

## How to upgrade to a new version of the Scandit Barcode Scanner

Whenever you update to the newest version you simply need to remove the already installed plugin and add the newly downloaded version.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    cd <directory of your project>
	phonegap plugin rm com.mirasense.scanditsdk.plugin
	phonegap plugin add <path to downloaded and unzipped plugin>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
