package com.blockidplugin


import android.view.View
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

class RNTScannerViewManager : SimpleViewManager<View>() {
  override fun getName(): String {
    return "RNTScannerView"
  }
  override fun createViewInstance(reactContext: ThemedReactContext): FLNativeScannerView {
  return  FLNativeScannerView(reactContext)
  }
}
