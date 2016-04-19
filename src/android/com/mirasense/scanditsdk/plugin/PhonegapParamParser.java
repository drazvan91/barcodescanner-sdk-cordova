package com.mirasense.scanditsdk.plugin;

import android.app.Activity;
import android.graphics.Rect;
import android.os.Bundle;
import android.util.Log;

import java.util.List;

/**
 * Created by mo on 14/12/15.
 */
public class PhonegapParamParser {

    public static final String paramSearchBar = "searchBar".toLowerCase();
    public static final String paramSearchBarPlaceholderText = "searchBarPlaceholderText".toLowerCase();
    public static final String paramMinSearchBarBarcodeLength = "minSearchBarBarcodeLength".toLowerCase();
    public static final String paramMaxSearchBarBarcodeLength = "maxSearchBarBarcodeLength".toLowerCase();

    public static final String paramPortraitMargins = "portraitMargins".toLowerCase();
    public static final String paramLandscapeMargins = "landscapeMargins".toLowerCase();
    public static final String paramPortraitConstraints = "portraitConstraints".toLowerCase();
    public static final String paramLandscapeConstraints = "landscapeConstraints".toLowerCase();
    public static final String paramAnimationDuration = "animationDuration".toLowerCase();

    public static final String paramMarginLeft = "leftMargin".toLowerCase();
    public static final String paramMarginTop = "topMargin".toLowerCase();
    public static final String paramMarginRight = "rightMargin".toLowerCase();
    public static final String paramMarginBottom = "bottomMargin".toLowerCase();
    public static final String paramWidth = "width".toLowerCase();
    public static final String paramHeight = "height".toLowerCase();
    
    public static final String paramContinuousMode = "continuousMode".toLowerCase();
    public static final String paramPaused = "paused".toLowerCase();


    public static void updatePicker(SearchBarBarcodePicker picker, Bundle bundle,
                                    SearchBarBarcodePicker.ScanditSDKSearchBarListener listener) {
        
        if (picker == null || bundle == null) {
            return;
        }
        
        if (bundle.containsKey(paramSearchBar)) {
            picker.showSearchBar(bundle.getBoolean(paramSearchBar));
            picker.setOnSearchBarListener(listener);
        }

        if (bundle.containsKey(paramSearchBarPlaceholderText)) {
            picker.setSearchBarPlaceholderText(bundle.getString(paramSearchBarPlaceholderText));
        }

        if (bundle.containsKey(paramMinSearchBarBarcodeLength)) {

        }

        if (bundle.containsKey(paramMaxSearchBarBarcodeLength)) {

        }
    }

    public static void updateLayout(final Activity activity, final SearchBarBarcodePicker picker,
                                    Bundle bundle) {
        
        if (picker == null || bundle == null) {
            return;
        }
        
        double animationDuration = 0;
        if (bundle.containsKey(paramAnimationDuration)) {
            Object duration = bundle.get(paramAnimationDuration);
            if (duration instanceof Number) {
                animationDuration = ((Number) duration).doubleValue();
            }
        }
        
        if (bundle.containsKey(paramPortraitMargins) || bundle.containsKey(paramLandscapeMargins)) {
            Rect portraitMargins = null;
            Rect landscapeMargins = null;
            
            if (bundle.containsKey(paramPortraitMargins)) {
                portraitMargins = extractMarginsRect(bundle, paramPortraitMargins);
            }
            
            if (bundle.containsKey(paramLandscapeMargins)) {
                portraitMargins = extractMarginsRect(bundle, paramLandscapeMargins);
            }
            
            SearchBarBarcodePicker.Constraints portraitConstraints =
            new SearchBarBarcodePicker.Constraints(portraitMargins);
            SearchBarBarcodePicker.Constraints landscapeConstraints =
            new SearchBarBarcodePicker.Constraints(landscapeMargins);
            picker.adjustSize(activity, portraitConstraints, landscapeConstraints, animationDuration);
            
            
        } else if (bundle.containsKey(paramPortraitConstraints) || bundle.containsKey(paramLandscapeConstraints)) {
            SearchBarBarcodePicker.Constraints portraitConstraints = new SearchBarBarcodePicker.Constraints();
            SearchBarBarcodePicker.Constraints landscapeConstraints = new SearchBarBarcodePicker.Constraints();
            
            if (bundle.containsKey(paramPortraitConstraints)) {
                portraitConstraints = extractConstraints(bundle, paramPortraitConstraints);
            }
            
            if (bundle.containsKey(paramLandscapeConstraints)) {
                landscapeConstraints = extractConstraints(bundle, paramLandscapeConstraints);
            }
            
            picker.adjustSize(activity, portraitConstraints, landscapeConstraints, animationDuration);
        }
    }
    
    private static Rect extractMarginsRect(Bundle bundle, String key) {
        Rect result = null;
        if (bundle.getSerializable(key) != null
            && bundle.getSerializable(key) instanceof List) {
            List<Object> list = (List<Object>) bundle.getSerializable(key);
            if (list.size() == 4 &&
                (UIParamParser.checkClassOfListObjects(list, Integer.class) ||
                 UIParamParser.checkClassOfListObjects(list, String.class))) {
                    result = new Rect(
                                      UIParamParser.getSize(list.get(0), ScanditSDK.SCREEN_WIDTH),
                                      UIParamParser.getSize(list.get(1), ScanditSDK.SCREEN_HEIGHT),
                                      UIParamParser.getSize(list.get(2), ScanditSDK.SCREEN_WIDTH),
                                      UIParamParser.getSize(list.get(3), ScanditSDK.SCREEN_HEIGHT));
                }
        } else if (bundle.getString(key) != null) {
            String portraitMarginsString = bundle.getString(key);
            String[] split = portraitMarginsString.split("[/]");
            if (split.length == 4) {
                try {
                    result = new Rect(
                                      UIParamParser.getSize(split[0], ScanditSDK.SCREEN_WIDTH),
                                      UIParamParser.getSize(split[1], ScanditSDK.SCREEN_HEIGHT),
                                      UIParamParser.getSize(split[2], ScanditSDK.SCREEN_WIDTH),
                                      UIParamParser.getSize(split[3], ScanditSDK.SCREEN_HEIGHT));
                } catch (NumberFormatException e) {
                    e.printStackTrace();
                }
            }
        } else {
            Log.e("ScanditSDK", "Failed to parse '" + key + "' - wrong type.");
        }
        return result;
    }
    
    private static SearchBarBarcodePicker.Constraints extractConstraints(Bundle bundle, String key) {
        SearchBarBarcodePicker.Constraints result = new SearchBarBarcodePicker.Constraints();
        Bundle constraintsBundle = bundle.getBundle(key);
        if (constraintsBundle != null) {
            result.setLeftMargin(UIParamParser.getSize(
                                                       constraintsBundle, paramMarginLeft, ScanditSDK.SCREEN_WIDTH));
            result.setTopMargin(UIParamParser.getSize(
                                                      constraintsBundle, paramMarginTop, ScanditSDK.SCREEN_HEIGHT));
            result.setRightMargin(UIParamParser.getSize(
                                                        constraintsBundle, paramMarginRight, ScanditSDK.SCREEN_WIDTH));
            result.setBottomMargin(UIParamParser.getSize(
                                                         constraintsBundle, paramMarginBottom, ScanditSDK.SCREEN_HEIGHT));
            result.setWidth(UIParamParser.getSize(
                                                  constraintsBundle, paramWidth, ScanditSDK.SCREEN_WIDTH));
            result.setHeight(UIParamParser.getSize(
                                                   constraintsBundle, paramHeight, ScanditSDK.SCREEN_HEIGHT));
        } else {
            Log.e("ScanditSDK", "Failed to parse '" + key + "' - wrong type.");
        }
        return result;
    }
}
