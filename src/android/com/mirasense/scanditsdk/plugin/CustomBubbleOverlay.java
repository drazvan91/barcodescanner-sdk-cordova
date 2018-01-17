package com.mirasense.scanditsdk.plugin;

import android.util.Log;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.view.Gravity;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.widget.LinearLayout;
import android.widget.FrameLayout.LayoutParams;
import java.lang.Runnable;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;
import com.scandit.recognition.Quadrilateral;

public class CustomBubbleOverlay extends FrameLayout {
  
  private static final int INDICATOR_WIDTH = 150;
  private static final int INDICATOR_HEIGHT = 50;
  private static final int INDICATOR_MARGIN = 10;
  
  Map<Long, BubbleData> barcodeState;
  Map<Long, Quadrilateral> barcodeLocation;
  Paint highlightPaint;
  
  CustomBubbleOverlay(Context context) {
    super(context);
    highlightPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    highlightPaint.setStyle(Paint.Style.FILL);
    barcodeState = new HashMap();
    barcodeLocation = new HashMap();
    setWillNotDraw(false);
  }
  
  private int pxFromDp(int dp) {
    return (int) (dp * getContext().getResources().getDisplayMetrics().density + 0.5f);
  }
  
  public void updateTrackedBarcodes(Map<Long, Quadrilateral> updatedLocation) {
    barcodeLocation.clear();
    barcodeLocation.putAll(updatedLocation);
    post(new Runnable() {
      public void run() {
        drawIndicators();
      }
    });
  }
  
  public void setBarcodeStates(Map<Long, BubbleData> barcodeState) {
    this.barcodeState.putAll(barcodeState);
  }
  
  private void drawIndicators() {
    removeAllViews();
    Map<Long, Quadrilateral> locationsCopy = new HashMap(barcodeLocation);
    Map<Long, BubbleData> statesCopy = new HashMap(barcodeState);
    for (Map.Entry<Long, Quadrilateral> entry : locationsCopy.entrySet()) {
      Quadrilateral location = entry.getValue();
      BubbleData data = statesCopy.get(entry.getKey());
      if (data == null) {
        continue;
      }
      FrameLayout root = new FrameLayout(getContext());      
      TextView stockText = new TextView(getContext());
      TextView deliveryText = new TextView(getContext());
      
      root.setBackgroundColor(Color.WHITE);
      stockText.setText("Stock " + data.stock);
      stockText.setTextColor(Color.BLACK);
      deliveryText.setText("Delivery " + data.delivery);
      deliveryText.setTextColor(Color.BLACK);
      
      FrameLayout.LayoutParams rootParams = new FrameLayout.LayoutParams(pxFromDp(INDICATOR_WIDTH), pxFromDp(INDICATOR_HEIGHT));
      rootParams.topMargin = (location.top_left.y + location.top_right.y) / 2 - pxFromDp(INDICATOR_HEIGHT) - pxFromDp(INDICATOR_MARGIN);
      rootParams.leftMargin = (location.top_left.x + location.top_right.x) / 2 - pxFromDp(INDICATOR_WIDTH) / 2;
      
      FrameLayout.LayoutParams stockParams = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT);
      stockParams.gravity = Gravity.CENTER_HORIZONTAL;
      
      FrameLayout.LayoutParams deliveryParams = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT);
      deliveryParams.gravity = Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL;
      
      root.addView(stockText, stockParams);
      root.addView(deliveryText, deliveryParams);
      addView(root, rootParams);
    }
  }
  
  @Override
  public void onDraw(Canvas canvas) {
    for (Map.Entry<Long, Quadrilateral> entry : barcodeLocation.entrySet()) {
      Quadrilateral location = entry.getValue();
      BubbleData data = barcodeState.get(entry.getKey());
      if (data == null) {
        continue;
      }
      highlightPaint.setColor(data.color);
      Path path = new Path();
      path.moveTo(location.top_left.x, location.top_left.y);
      path.lineTo(location.top_right.x, location.top_right.y);
      path.lineTo(location.bottom_right.x, location.bottom_right.y);
      path.lineTo(location.bottom_left.x, location.bottom_left.y);
      path.close();
      canvas.drawPath(path, highlightPaint);
    }
  }
}
