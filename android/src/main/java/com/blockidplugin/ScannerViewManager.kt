package com.blockidplugin


import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

class ScannerViewManager: SimpleViewManager<ScannerView>() {
  override fun getName(): String {
    return "RNTScannerView"
  }
  override fun createViewInstance(reactContext: ThemedReactContext): ScannerView {
    return ScannerView(reactContext)
  }

}
