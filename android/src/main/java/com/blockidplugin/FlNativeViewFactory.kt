package com.blockidplugin
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup

class FlNativeViewFactory : SimpleViewManager<ReactViewGroup>() {

   var nativeView: FLNativeScannerView? = null

  override fun getName(): String {
    return "FlNativeViewFactory"
  }

  override fun createViewInstance(reactContext: ThemedReactContext): ReactViewGroup {
    val reactViewGroup = ReactViewGroup(reactContext)
    val nativeScannerView = FLNativeScannerView(reactContext)
    nativeView = nativeScannerView
    reactViewGroup.addView(nativeScannerView)
    return reactViewGroup
  }
}
