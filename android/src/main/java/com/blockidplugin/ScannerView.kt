package com.blockidplugin


import android.content.Context
import android.view.View
import android.widget.FrameLayout
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.onekosmos.blockid.sdk.cameramodule.BIDScannerView

class ScannerView(context: Context) : ReactViewGroup(context) {
  var bidScannerView: BIDScannerView

  init {
    this.setBackgroundColor(0xFF0000FF.toInt()) // Blue background++
    bidScannerView = BIDScannerView(context)
    this.addView(bidScannerView, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
    ScannerViewRef.bidScannerView = bidScannerView
  }

  override fun onLayout(
    changed: Boolean,
    left: Int,
    top: Int,
    right: Int,
    bottom: Int
  ) {
    super.onLayout(changed, left, top, right, bottom)
    if (childCount > 0) {
      val child = getChildAt(0)
      child.layout(0, 0, right - left, bottom - top)
    }
  }

}

class RNTScannerViewManager : SimpleViewManager<View>() {
  override fun getName(): String {
    return "RNTScannerView"
  }
  override fun createViewInstance(reactContext: ThemedReactContext): FLNativeScannerView {
  return  FLNativeScannerView(reactContext)
  }
}
