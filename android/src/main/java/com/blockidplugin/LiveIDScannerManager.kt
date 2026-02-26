package com.blockidplugin

import android.view.Choreographer
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactPropGroup

class LiveIDScannerManager(
  private val reactContext: ReactApplicationContext
) : ViewGroupManager<FrameLayout>() {

  private var propWidth: Int? = null
  private var propHeight: Int? = null
  private var choreographerCallback: Choreographer.FrameCallback? = null

  override fun getName() = REACT_CLASS

  /**
   * Return a FrameLayout which will later hold the Fragment
   */

  override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
    return FrameLayout(reactContext).apply {
      id = View.generateViewId()
    }
  }

  override fun getCommandsMap() = mapOf("create" to COMMAND_CREATE)

  /**
   * Handle "create" command (called from JS) and call createFragment method
   */
  override fun receiveCommand(
    root: FrameLayout,
    commandId: String,
    args: ReadableArray?
  ) {
    super.receiveCommand(root, commandId, args)
    val reactNativeViewId = requireNotNull(args).getInt(0)
    when (commandId.toInt()) {
      COMMAND_CREATE -> createFragment(root, reactNativeViewId)
    }
  }

  @ReactPropGroup(names = ["width", "height"], customType = "Style")
  fun setStyle(view: FrameLayout, index: Int, value: Int) {
    if (index == 0) propWidth = value
    if (index == 1) propHeight = value
  }

  override fun onDropViewInstance(view: FrameLayout) {
    super.onDropViewInstance(view)

    choreographerCallback?.let { callback ->
      Choreographer.getInstance().removeFrameCallback(callback)
      choreographerCallback = null
    }

    val activity = reactContext.currentActivity as? FragmentActivity
    activity?.let { fragmentActivity ->
      val fragment = fragmentActivity.supportFragmentManager
        .findFragmentByTag(view.id.toString())
      fragment?.let {
        fragmentActivity.supportFragmentManager
          .beginTransaction()
          .remove(it)
          .commitAllowingStateLoss()
      }
    }
  }

  /**
   * Replace your React Native view with a custom fragment
   */
  private fun createFragment(root: FrameLayout, reactNativeViewId: Int) {
    val parentView = root.findViewById<ViewGroup>(reactNativeViewId)
    if (parentView == null) {
      android.util.Log.e("LiveIDScannerManager", "Cannot create fragment: container view $reactNativeViewId not found")
      return
    }

    val activity = reactContext.currentActivity as? FragmentActivity
    if (activity == null || activity.isFinishing || activity.isDestroyed) {
      android.util.Log.e("LiveIDScannerManager", "Cannot create fragment: activity is not available")
      return
    }

    val existingFragment = activity.supportFragmentManager
      .findFragmentByTag(reactNativeViewId.toString())

    if (existingFragment == null) {
      setupLayout(parentView)
      val fragment = ScannerFragment()
      activity.supportFragmentManager
        .beginTransaction()
        .replace(reactNativeViewId, fragment, reactNativeViewId.toString())
        .commitAllowingStateLoss()
    }
  }

  private fun setupLayout(view: View) {
    choreographerCallback?.let { callback ->
      Choreographer.getInstance().removeFrameCallback(callback)
    }

    choreographerCallback = object : Choreographer.FrameCallback {
      override fun doFrame(frameTimeNanos: Long) {
        manuallyLayoutChildren(view)
        view.viewTreeObserver.dispatchOnGlobalLayout()
        Choreographer.getInstance().postFrameCallback(this)
      }
    }

    choreographerCallback?.let { callback ->
      Choreographer.getInstance().postFrameCallback(callback)
    }
  }

  /**
   * Layout all children properly
   */
  private fun manuallyLayoutChildren(view: View) {
    val width = propWidth ?: view.width
    val height = propHeight ?: view.height

    if (width > 0 && height > 0) {
      view.measure(
        View.MeasureSpec.makeMeasureSpec(width, View.MeasureSpec.EXACTLY),
        View.MeasureSpec.makeMeasureSpec(height, View.MeasureSpec.EXACTLY)
      )
      view.layout(0, 0, width, height)
    }
  }

  companion object {
    private const val REACT_CLASS = "LiveIDScannerManager"
    private const val COMMAND_CREATE = 1
  }
}
