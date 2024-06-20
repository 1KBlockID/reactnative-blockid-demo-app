package com.blockidplugin

import com.onekosmos.blockid.sdk.cameramodule.BIDScannerView

//object ScannerViewRef {
//   var bidScannerView: BIDScannerView? = null
//}
 object ScannerViewRef {
  private var scannerManager: ScannerRefViewManager? = null
  var bidScannerView: BIDScannerView? = null
  fun setCustomViewManager(viewManager: ScannerRefViewManager) {
    scannerManager = viewManager
  }

  fun getCustomViewManagerInstance(): ScannerRefViewManager? {
    return scannerManager
  }
}
