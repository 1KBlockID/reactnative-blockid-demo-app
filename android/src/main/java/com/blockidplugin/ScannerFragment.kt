package com.blockidplugin

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class ScannerFragment : Fragment() {

  private var scannerView: NativeScannerView? = null
  private var isViewCreated = false

  override fun onCreateView(
    inflater: LayoutInflater,
    container: ViewGroup?,
    savedInstanceState: Bundle?
  ): View? {
    return try {
      scannerView = NativeScannerView(requireContext()).apply {
        layoutParams = ViewGroup.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT,
          ViewGroup.LayoutParams.MATCH_PARENT
        )
      }
      isViewCreated = true
      scannerView
    } catch (e: Exception) {
      android.util.Log.e("ScannerFragment", "Error creating scanner view", e)
      View(requireContext())
    }
  }

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)

    lifecycleScope.launch {
      delay(100)
      initializeCamera()
    }
  }

  override fun onResume() {
    super.onResume()
    if (isViewCreated) {
      lifecycleScope.launch {
        delay(100)
        initializeCamera()
      }
    }
  }

  override fun onPause() {
    super.onPause()
    try {
      ScannerViewRef.bidScannerView?.let { bidScanner ->

      }
    } catch (e: Exception) {
      android.util.Log.e("ScannerFragment", "Error during pause cleanup", e)
    }
  }

  override fun onDestroyView() {
    super.onDestroyView()
    isViewCreated = false
    scannerView = null

    // Clear the static reference
    ScannerViewRef.bidScannerView = null
  }

  private fun initializeCamera() {
    try {
      ScannerViewRef.bidScannerView?.let { bidScanner ->

      }
    } catch (e: Exception) {
      android.util.Log.e("ScannerFragment", "Error initializing camera", e)
    }
  }
}
