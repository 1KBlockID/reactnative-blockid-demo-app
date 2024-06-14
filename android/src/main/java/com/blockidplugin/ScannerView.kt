package com.blockidplugin


import android.content.Context
import android.widget.FrameLayout
import com.onekosmos.blockid.sdk.cameramodule.BIDScannerView

class ScannerView(context: Context): FrameLayout(context) {
  public var bidScannerView: BIDScannerView

  init {
    bidScannerView = BIDScannerView(context)
    addView(bidScannerView)
    ScannerViewRef.bidScannerView = bidScannerView
  }
}
