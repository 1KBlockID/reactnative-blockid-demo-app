package com.blockidplugin

import android.content.Context
import android.widget.FrameLayout
import com.onekosmos.blockid.sdk.cameramodule.BIDScannerView

class NativeScannerView(context: Context): FrameLayout(context) {
   private var bidScannerView: BIDScannerView = BIDScannerView(context)

  init {
    addView(bidScannerView)
    ScannerViewRef.bidScannerView = bidScannerView
  }
}
