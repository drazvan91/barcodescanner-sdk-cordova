//  Copyright 2016 Scandit AG
//
//  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
//  in compliance with the License. You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software distributed under the
//  License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
//  express or implied. See the License for the specific language governing permissions and
//  limitations under the License.

package com.mirasense.scanditsdk.plugin;


import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Base class for the picker controllers.
 */
abstract class PickerControllerBase implements IPickerController {
    protected final CordovaPlugin mPlugin;
    protected final CallbackContext mCallbackContext;

    protected boolean mLegacyMode = false;
    protected boolean mContinuousMode = false;
    protected boolean mDidScanCallbackFinish = true;
    protected int mNextState = 0;

    PickerControllerBase(CordovaPlugin plugin, CallbackContext callbacks) {
        mPlugin = plugin;
        mCallbackContext = callbacks;
    }

    @Override
    public void finishDidScanCallback(JSONArray data) {
        if (data != null && data.length() > 0) {
            try {
                mNextState = data.getInt(0);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } else {
            mNextState = 0;
        }
        synchronized (this) {
            mDidScanCallbackFinish = true;
            notify();
        }
    }


    protected int sendPluginResultBlocking(PluginResult result) {
        if (mLegacyMode || !mContinuousMode) {
            mCallbackContext.sendPluginResult(result);
            return 0;
        }
        mDidScanCallbackFinish = false;
        mNextState = 0;

        try {
            mCallbackContext.sendPluginResult(result);
            synchronized (this) {
                while (!mDidScanCallbackFinish) {
                    wait();
                }
            }
        } catch (InterruptedException e) {
        }

        return mNextState;
    }
}
