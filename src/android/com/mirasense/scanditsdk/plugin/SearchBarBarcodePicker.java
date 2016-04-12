package com.mirasense.scanditsdk.plugin;

import android.app.Activity;
import android.content.Context;
import android.graphics.Rect;
import android.util.Log;
import android.view.Display;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.Transformation;
import android.widget.RelativeLayout;

import com.scandit.barcodepicker.BarcodePicker;
import com.scandit.barcodepicker.ScanSettings;
import com.scandit.base.system.SbSystemUtils;

/**
 * Created by mo on 29/10/15.
 */
public class SearchBarBarcodePicker extends BarcodePicker {

    private ScanditSDKSearchBar mSearchBar;
    private ScanditSDKSearchBarListener mListener;

    public static Constraints portraitConstraints = new Constraints();
    public static Constraints landscapeConstraints = new Constraints();


    public SearchBarBarcodePicker(Context context) {
        super(context);
    }

    public SearchBarBarcodePicker(Context context, ScanSettings settings) {
        super(context, settings);
    }
    
    public void adjustSize(Activity activity, Constraints newPortraitConstraints,
                           Constraints newLandscapeConstraints, double animationDuration) {
        final RelativeLayout.LayoutParams rLayoutParams = new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        Display display = activity.getWindowManager().getDefaultDisplay();
        int screenWidth = display.getWidth();
        int screenHeight = display.getHeight();
        
        final Constraints oldConstraints;
        final Constraints newConstraints;
        if (screenHeight > screenWidth) {
            oldConstraints = portraitConstraints;
            newConstraints = newPortraitConstraints;
        } else {
            oldConstraints = landscapeConstraints;
            newConstraints = newLandscapeConstraints;
        }
        
        Animation anim = new Animation() {
            @Override
            protected void applyTransformation(float interpolatedTime, Transformation t) {
                if (newConstraints.getLeftMargin() == null) {
                    rLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, RelativeLayout.TRUE);
                } else {
                    rLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, 0);
                }
                if (newConstraints.getTopMargin() == null) {
                    rLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, RelativeLayout.TRUE);
                } else {
                    rLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, 0);
                }

                if (newConstraints.getLeftMargin() != null) {
                    rLayoutParams.leftMargin = calculateInterpolatedValue(
                            oldConstraints.getLeftMargin(), newConstraints.getLeftMargin(), interpolatedTime);
                }
                if (newConstraints.getTopMargin() != null) {
                    rLayoutParams.topMargin = calculateInterpolatedValue(
                            oldConstraints.getTopMargin(), newConstraints.getTopMargin(), interpolatedTime);
                }
                if (newConstraints.getRightMargin() != null) {
                    rLayoutParams.rightMargin = calculateInterpolatedValue(
                            oldConstraints.getRightMargin(), newConstraints.getRightMargin(), interpolatedTime);
                }
                if (newConstraints.getBottomMargin() != null) {
                    rLayoutParams.bottomMargin = calculateInterpolatedValue(
                            oldConstraints.getBottomMargin(), newConstraints.getBottomMargin(), interpolatedTime);
                }
                if (newConstraints.getWidth() != null) {
                    rLayoutParams.width = calculateInterpolatedValue(
                            oldConstraints.getWidth(), newConstraints.getWidth(), interpolatedTime);
                }
                if (newConstraints.getHeight() != null) {
                    rLayoutParams.height = calculateInterpolatedValue(
                            oldConstraints.getHeight(), newConstraints.getHeight(), interpolatedTime);
                }
                setLayoutParams(rLayoutParams);
            }
        };
        anim.setDuration((int) (animationDuration * 1000));
        startAnimation(anim);

        portraitConstraints = newPortraitConstraints;
        landscapeConstraints = newLandscapeConstraints;
    }

    public void setOnSearchBarListener(ScanditSDKSearchBarListener listener) {
        mListener = listener;
    }

    public void showSearchBar(boolean show) {
        if (show && mSearchBar == null) {
            mSearchBar = new ScanditSDKSearchBar(getContext(), new OnClickListener() {
                @Override
                public void onClick(View v) {
                    onSearchClicked();
                }
            });
            RelativeLayout.LayoutParams rParams = new RelativeLayout.LayoutParams(
                    LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
            rParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
            rParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
            addView(mSearchBar, rParams);

            getOverlayView().setTorchButtonMarginsAndSize(15, 55, 40, 40);
            getOverlayView().setCameraSwitchButtonMarginsAndSize(15, 55, 40, 40);

            requestChildFocus(null, null);
        } else if (!show && mSearchBar != null) {
            removeView(mSearchBar);
            mSearchBar = null;
            invalidate();
        }
    }

    protected void setSearchBarPlaceholderText(String text) {
        mSearchBar.setHint(text);
    }

    private void onSearchClicked() {
        mListener.didEnter(mSearchBar.getText());
    }

    private int calculateInterpolatedValue(Integer oldValue, Integer newValue, float interpolatedTime) {
        if (oldValue != null) {
            return SbSystemUtils.pxFromDp(getContext(),
                    (int) (oldValue + (newValue - oldValue) * interpolatedTime));
        } else {
            return SbSystemUtils.pxFromDp(getContext(), newValue);
        }
    }


    public interface ScanditSDKSearchBarListener {
        /**
         *  Called whenever a string was entered in the search bar and the button to search was pressed.
         *
         *  @param entry the text that has been entered by the user.
         */
        void didEnter(String entry);
    }


    /**
     * Constraints for the barcode picker consisting of margins, width and height. The getters
     * do not necessarily return the properties previously set but may return 0 for a margin if too
     * few margins were set or return null for width/height if too many margins were set.
     */
    public static class Constraints {
        private Integer mLeftMargin = null;
        private Integer mTopMargin = null;
        private Integer mRightMargin = null;
        private Integer mBottomMargin = null;
        private Integer mWidth = null;
        private Integer mHeight = null;

        public Constraints() {}

        public Constraints(Rect margins) {
            if (margins != null) {
                mLeftMargin = margins.left;
                mTopMargin = margins.top;
                mRightMargin = margins.right;
                mBottomMargin = margins.bottom;
            }
        }

        public Integer getLeftMargin() {
            if (mLeftMargin == null && (mRightMargin == null || mWidth == null)) return 0;
            return mLeftMargin;
        }
        public void setLeftMargin(Integer value) { mLeftMargin = value; }

        public Integer getTopMargin() {
            if (mTopMargin == null && (mBottomMargin == null || mHeight == null)) return 0;
            return mTopMargin;
        }
        public void setTopMargin(Integer value) { mTopMargin = value; }

        public Integer getRightMargin() {
            if (mRightMargin == null && mLeftMargin == null) return 0;
            return mRightMargin;
        }
        public void setRightMargin(Integer value) { mRightMargin = value; }

        public Integer getBottomMargin() {
            if (mBottomMargin == null && mTopMargin == null) return 0;
            return mBottomMargin;
        }
        public void setBottomMargin(Integer value) { mBottomMargin = value; }

        public Integer getWidth() {
            if (mLeftMargin != null && mRightMargin != null) return null;
            return mWidth;
        }
        public void setWidth(Integer value) { mWidth = value; }

        public Integer getHeight() {
            if (mTopMargin != null && mBottomMargin != null) return null;
            return mHeight;
        }
        public void setHeight(Integer value) { mHeight = value; }
    }
}
