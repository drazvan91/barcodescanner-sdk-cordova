
//
//  Copyright 2010 Mirasense AG
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//
//

package com.mirasense.scanditsdk.plugin;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;

import com.scandit.barcodepicker.OnScanListener;
import com.scandit.barcodepicker.ScanSession;
import com.scandit.barcodepicker.ScanSettings;
import com.scandit.barcodepicker.internal.Code;
import com.scandit.base.util.JSONParseException;
import com.scandit.recognition.Barcode;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


/**
 * Activity implementing the full-screen picker support. This activity is launched by the
 * FullScreenPickerController
 *
 */
public class FullScreenPickerActivity
        extends Activity
        implements OnScanListener, BarcodePickerWithSearchBar.SearchBarListener,
                   PickerStateMachine.Callback {
    
    public static final int CANCEL = 0;
    public static final int SCAN = 1;
    public static final int MANUAL = 2;

    private static FullScreenPickerActivity sActiveActivity = null;

    private boolean mContinuousMode = false;

    private boolean mLegacyMode = false;
    
    private PickerStateMachine mPickerStateMachine = null;
    private int mStateBeforeSuspend = PickerStateMachine.STOPPED;


    public static void setState(int state) {
        if (sActiveActivity == null)
            return;
        sActiveActivity.mPickerStateMachine.setState(state);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        JSONObject settings = null;
        Bundle options = null;
        Bundle overlayOptions = null;

        if (getIntent().getExtras().containsKey("settings")) {
            try {
                settings = new JSONObject(getIntent().getExtras().getString("settings"));
            } catch (JSONException e) {
                e.printStackTrace();
            }
            mLegacyMode = false;
        } else {
            mLegacyMode = true;
        }
        if (getIntent().getExtras().containsKey("options")) {
            options = getIntent().getExtras().getBundle("options");
        }
        if (getIntent().getExtras().containsKey("overlayOptions")) {
            overlayOptions = getIntent().getExtras().getBundle("overlayOptions");
        }

        initializeAndStartBarcodeRecognition(settings, options, overlayOptions);
    }
    
    @SuppressWarnings("deprecation")
    private void initializeAndStartBarcodeRecognition(
            JSONObject settings, Bundle options, Bundle overlayOptions) {
        // Switch to full screen.
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        if (options.getBoolean("secure")) {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
        }

        ScanSettings scanSettings;
        if (mLegacyMode) {
            scanSettings = LegacySettingsParamParser.getSettings(options);
        } else {
            try {
                scanSettings = ScanSettings.createWithJson(settings);
            } catch (JSONParseException e) {
                Log.e("ScanditSDK", "Exception when creating settings");
                e.printStackTrace();
                scanSettings = ScanSettings.create();
            }
        }
        BarcodePickerWithSearchBar picker = new BarcodePickerWithSearchBar(this, scanSettings);
        picker.setOnScanListener(this);

        this.setContentView(picker);
        mPickerStateMachine = new PickerStateMachine(picker, this);

        // Set all the UI options.
        PhonegapParamParser.updatePicker(picker, options, this);

        if (settings == null) {
            LegacyUIParamParser.updatePickerUI(this, picker, options);
        } else {
            UIParamParser.updatePickerUI(picker, overlayOptions);
            PhonegapParamParser.updatePicker(picker, overlayOptions, this);
        }

        mContinuousMode = Marshal.shouldRunInContinuousMode(options);


        mStateBeforeSuspend = Marshal.shouldStartInPausedState(options)
                ? PickerStateMachine.PAUSED
                : PickerStateMachine.ACTIVE;
    }
    
    @Override
    protected void onPause() {
        sActiveActivity = null;
        // When the activity is in the background immediately stop the scanning to save resources
        // and free the camera. Remember the last state, so we can put the picker into the same
        // state in onResume.
        mStateBeforeSuspend = mPickerStateMachine.getState();
        mPickerStateMachine.setState(PickerStateMachine.STOPPED);
        super.onPause();
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        sActiveActivity = this;
        // Once the activity is in the foreground again, restore previous picker state.
        mPickerStateMachine.setState(mStateBeforeSuspend);

    }

    public void switchTorchOn(boolean enabled) {
        mPickerStateMachine.getPicker().switchTorchOn(enabled);
    }

    public void didCancel() {
        mPickerStateMachine.setState(PickerStateMachine.STOPPED);
        setResult(CANCEL);
        finish();
    }

    @Override
    public void didScan(ScanSession session) {
        if (!mContinuousMode) {
            mPickerStateMachine.switchToNextScanState(2, session);

            Intent intent = new Intent();
            Barcode code = session.getNewlyRecognizedCodes().get(0);
            if (mLegacyMode) {
                intent.putExtra("barcode", code.getData());
                intent.putExtra("symbology", Code.symbologyToString(code.getSymbology(),
                                code.isGs1DataCarrier()));
            } else {
                JSONArray eventArgs = Marshal.createEventArgs(ScanditSDK.DID_SCAN_EVENT,
                        ResultRelay.jsonForSession(session));
                intent.putExtra("jsonString", eventArgs.toString());
            }
            setResult(SCAN, intent);
            finish();
        } else {
            Bundle bundle = new Bundle();
            if (mLegacyMode) {
                bundle.putString("barcode", session.getNewlyRecognizedCodes().get(0).getData());
                bundle.putString("symbology",
                        session.getNewlyRecognizedCodes().get(0).getSymbologyName());
            } else {
                JSONArray eventArgs = Marshal.createEventArgs(ScanditSDK.DID_SCAN_EVENT,
                        ResultRelay.jsonForSession(session));
                bundle.putString("jsonString", eventArgs.toString());
            }
            int nextState = ResultRelay.relayResult(bundle);
            mPickerStateMachine.switchToNextScanState(nextState, session);
        }
    }

    private void addManualSearchResultToBundle(String entry, Bundle bundle) {
        if (mLegacyMode) {
            bundle.putString("barcode", entry.trim());
            bundle.putString("symbology", "UNKNOWN");
        } else {
            JSONArray args = Marshal.createEventArgs(ScanditSDK.DID_MANUAL_SEARCH_EVENT, entry);
            bundle.putString("jsonString", args.toString());
        }
        // no need to wait for result
        bundle.putBoolean("waitForResult", false);
    }
    
    @Override
    public void didEnter(String entry) {
        if (!mContinuousMode) {
            Intent intent = new Intent();
            addManualSearchResultToBundle(entry.trim(), intent.getExtras());
            setResult(MANUAL, intent);
            finish();
            return;
        }
        Bundle bundle = new Bundle();
        addManualSearchResultToBundle(entry.trim(), bundle);
        ResultRelay.relayResult(bundle);
    }
    
    @Override
    public void onBackPressed() {
        didCancel();
    }

    
    public static void close() {
        if (sActiveActivity != null) {
            sActiveActivity.didCancel();
        }
    }

    public static void setTorchEnabled(boolean enabled) {
        if (sActiveActivity != null) {
            sActiveActivity.switchTorchOn(enabled);
        }
    }

    @Override
    public void pickerEnteredState(BarcodePickerWithSearchBar picker, int newState) {
        // don't produce events in legacy mode. They would be interpreted as scan events.
        if (mLegacyMode) return;

        if (newState == PickerStateMachine.STOPPED) {

        }
        Bundle resultBundle = new Bundle();
        JSONArray didStopArgs = Marshal.createEventArgs(ScanditSDK.DID_CHANGE_STATE_EVENT, newState);
        resultBundle.putString("jsonString", didStopArgs.toString());
        resultBundle.putBoolean("waitForResult", false);
        ResultRelay.relayResult(resultBundle);
    }

    public static void applyScanSettings(ScanSettings scanSettings) {
        if (sActiveActivity == null || sActiveActivity.mPickerStateMachine == null) return;

        sActiveActivity.mPickerStateMachine.applyScanSettings(scanSettings);
    }

    public static void updateUI(Bundle overlayOptions) {
        if (sActiveActivity == null || sActiveActivity.mPickerStateMachine == null) return;
        UIParamParser.updatePickerUI(sActiveActivity.mPickerStateMachine.getPicker(), overlayOptions);
    }
}