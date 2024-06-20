package com.blockidplugin

import android.content.Context
import android.graphics.Color
import android.widget.FrameLayout
import com.onekosmos.blockid.sdk.cameramodule.BIDScannerView

class FLNativeScannerView(context: Context): FrameLayout(context) {
   var bidScannerView: BIDScannerView

  init {
    bidScannerView = BIDScannerView(context)
    addView(bidScannerView)
    ScannerViewRef.bidScannerView = bidScannerView
  }
}
