package com.mirasense.scanditsdk.plugin;

import com.scandit.recognition.Barcode;
import com.scandit.recognition.Quadrilateral;
import com.scandit.recognition.TrackedBarcode;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import java.util.Map;
import java.util.Map.Entry;
import java.util.Iterator;
import java.util.HashMap;

public class BubbleUtils {
    
  public static Map<Long, JSONObject> determineStateObjects(JSONArray data, int dataIndex) {
      Map<Long, JSONObject> stateObjects = new HashMap();
      if (data != null && data.length() > dataIndex) {
          try {
              JSONObject jsonObject = data.getJSONObject(dataIndex);
              Iterator<String> iterator = jsonObject.keys();
              while (iterator.hasNext()) {
                  String id = iterator.next();
                  stateObjects.put(Long.parseLong(id), jsonObject.getJSONObject(id));
              }
          } catch (JSONException e) {
              e.printStackTrace();
          }
      }
      return stateObjects;
  }
  
  public static JSONArray jsonForTrackedCodes(Map<Long, TrackedBarcode> trackedCodes) {
      JSONArray array = new JSONArray();
      try {
          for (Map.Entry<Long, TrackedBarcode> entry: trackedCodes.entrySet()) {
              JSONObject object = new JSONObject();
              Barcode code = entry.getValue();
              object.put("symbology", code.getSymbologyName());
              object.put("gs1DataCarrier", code.isGs1DataCarrier());
              object.put("recognized", code.isRecognized());
              object.put("data", code.getData());
              object.put("compositeFlag", code.getCompositeFlag());
              object.put("uniqueId", entry.getKey());
              if (code.isRecognized()) {
                  JSONArray bytes = new JSONArray();
                  byte[] rawData = code.getRawData();
                  for (byte theByte : rawData) {
                      bytes.put((int) theByte);
                  }
                  object.put("rawData", bytes);
              }
              array.put(object);
          }
      } catch (JSONException e) {
          e.printStackTrace();
      }
      return array;
  }
  
  public static Quadrilateral convertLocation(Quadrilateral barcodeLocation, BarcodePickerWithSearchBar picker) {
      Quadrilateral convertedLocation = new Quadrilateral();
      convertedLocation.top_left = picker.convertPointToPickerCoordinates(barcodeLocation.top_left);
      convertedLocation.top_right = picker.convertPointToPickerCoordinates(barcodeLocation.top_right);
      convertedLocation.bottom_left = picker.convertPointToPickerCoordinates(barcodeLocation.bottom_left);
      convertedLocation.bottom_right = picker.convertPointToPickerCoordinates(barcodeLocation.bottom_right);
      return convertedLocation;
  }
}
