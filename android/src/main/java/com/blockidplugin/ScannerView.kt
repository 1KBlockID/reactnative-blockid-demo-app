package com.blockidplugin

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

class RNTScannerViewManager : SimpleViewManager<NativeScannerView>() {
  override fun getName(): String {
    return "RNTScannerView"
  }
  override fun createViewInstance(reactContext: ThemedReactContext): NativeScannerView {
  return  NativeScannerView(reactContext)
  }
}
