# Installation

## Preconditions
_Please make sure the latest [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/get-npm?utm_source=house&utm_medium=homepage&utm_campaign=free%20orgs&utm_term=Install%20npm) are installed._

To check if you have `node` and `npm` installed, run the following commands:

```bash
$ node -v
v8.6.0

$ npm -v
5.5.1
```

_Please note that your version numbers might differ._

## Install the Ionic CLI
Then, install the [Ionic CLI](https://ionicframework.com/docs/cli/) globally (you _may_ need `sudo`):

```bash
$ npm install -g ionic@latest
```

You can verify your installation with the `ionic --version` command.

```bash
$ ionic --version
3.19.0
```
_Example output, your version number might differ._

## Install Cordova

Ionic integrates with [Cordova](https://cordova.apache.org/) to provide native capabilities to your app.

```bash
$ npm install -g cordova
```

# Getting Started

## Install the dependencies

Run `npm install` to install the dependencies of the project that are needed to build it.

## Add the Scandit Cordova plugin

### Download

_If you don't have an account yet, you can sign up for a 30-day [Test SDK](https://ssl.scandit.com/customers/new?p=test)._

Login to your [Scandit SDK dashboard](https://ssl.scandit.com/sessions/new) and navigate to the [Downloads](https://ssl.scandit.com/sdk) page.

Find the Cordova/PhoneGap plugin of your choice (e.g. Barcode Scanner SDK for Phonegap) and download the latest version.

### Add the Scandit Cordova plugin

Unzip the plugin you downloaded in the previous step, then run the following command to add the plugin to the project:

```bash
$ ionic cordova plugin add <path to the unzipped plugin folder>
```

## Add the platform(s)

To add a platform to the project, run either or both of the following commands:

```bash
$ ionic cordova platform add ios
$ ionic cordova platform add android
```

_Note, that if you add the `ios` platform, you need to open the generated Xcode project and setup signing. After this is done, you can close Xcode and run the sample as explained below._

## Set the license key

Replace `-- ENTER YOUR SCANDIT LICENSE KEY HERE --` with your license key in `src/providers/scanner-service/scanner-service.ts`

## Run the sample on a device

```bash
ionic cordova run ios --device
```

Use the `--livereload`` option if you want to keep watching the source for changes and preview those on the device.  
_If you choose this option, please note that only the WebView contents are reloaded, which does not include native components, e.g. the barcode picker._
