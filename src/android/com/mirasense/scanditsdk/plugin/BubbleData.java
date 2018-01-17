package com.mirasense.scanditsdk.plugin;

import 	android.graphics.Color;
import 	org.json.JSONObject;

public class BubbleData {
  
  public final int stock;
  public final int color;
  public final String delivery;
  
  BubbleData(JSONObject jsonObject) {
    this.color = Color.parseColor(jsonObject.optString("color"));
    this.stock = jsonObject.optInt("stock");
    this.delivery = jsonObject.optString("date");
  }
}
