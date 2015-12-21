
Upgrading the Scandit Barcode Scanner {#cordova-howto-upgrade}
===================================


## How to upgrade from a test to a different edition

If you upgrade from the test edition you need to download the plugin from your new or updated account. Even if you continue to use the same account you need to redownload the plugin as its framework has changed with the upgrade. Once downloaded remove the old plugin from your project and add the new plugin as usual.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    cd <directory of your project>
	phonegap plugin rm com.mirasense.scanditsdk.plugin
	phonegap plugin add <path to downloaded and unzipped plugin>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Finally check that the app key of your enterprise account matches the one in your app. If it doesn't match, replace it with the one in your account.

## How to upgrade to a new version of the Scandit Barcode Scanner

Whenever you update to the newest version you simply need to remove the already installed plugin and add the newly downloaded version.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    cd <directory of your project>
	phonegap plugin rm com.mirasense.scanditsdk.plugin
	phonegap plugin add <path to downloaded and unzipped plugin>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~