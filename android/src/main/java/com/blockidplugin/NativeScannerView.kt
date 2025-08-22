package com.blockidplugin

import android.content.Context
import android.util.AttributeSet
import android.widget.FrameLayout
import com.onekosmos.blockid.sdk.cameramodule.BIDScannerView

class NativeScannerView : FrameLayout {
  private val bidScannerView: BIDScannerView

  constructor(context: Context) : super(context) {
    bidScannerView = createBIDScannerView(context)
    setupView()
  }

  constructor(context: Context, attrs: AttributeSet?) : super(context, attrs) {
    bidScannerView = createBIDScannerView(context)
    setupView()
  }

  constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : super(
    context,
    attrs,
    defStyleAttr
  ) {
    bidScannerView = createBIDScannerView(context)
    setupView()
  }

  private fun createBIDScannerView(context: Context): BIDScannerView {
    return try {
      val scanner = BIDScannerView(context)
      ScannerViewRef.bidScannerView = scanner
      scanner
    } catch (e: Exception) {
      android.util.Log.e("NativeScannerView", "Error creating BIDScannerView", e)
      throw e
    }
  }

  private fun setupView() {
    try {
      addView(
        bidScannerView, LayoutParams(
          LayoutParams.MATCH_PARENT,
          LayoutParams.MATCH_PARENT
        )
      )
    } catch (e: Exception) {
      android.util.Log.e("NativeScannerView", "Error setting up view", e)
    }
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    android.util.Log.d("NativeScannerView", "View attached to window")
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    android.util.Log.d("NativeScannerView", "View detached from window")

    ScannerViewRef.bidScannerView = null
  }
}
