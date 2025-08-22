package com.blockidplugin

import android.view.Choreographer
import android.view.View
import android.widget.FrameLayout
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactPropGroup

class ScannerManager(
  private val reactContext: ReactApplicationContext
) : SimpleViewManager<FrameLayout>() {

  private var propWidth: Int? = null
  private var propHeight: Int? = null
  private var choreographerCallback: Choreographer.FrameCallback? = null

  override fun getName(): String = REACT_CLASS

  override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
    return FrameLayout(reactContext).apply {
      id = View.generateViewId()
    }
  }

  override fun getCommandsMap(): Map<String, Int> {
    return mapOf("create" to COMMAND_CREATE)
  }

  override fun receiveCommand(view: FrameLayout, commandId: Int, args: ReadableArray?) {
    when (commandId) {
      COMMAND_CREATE -> {
        createFragment(view)
      }

      else -> super.receiveCommand(view, commandId, args)
    }
  }

  @ReactPropGroup(names = ["width", "height"], customType = "Style")
  fun setStyle(view: FrameLayout, index: Int, value: Int) {
    when (index) {
      0 -> propWidth = value
      1 -> propHeight = value
    }
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

  private fun createFragment(root: FrameLayout) {
    val activity = reactContext.currentActivity as? FragmentActivity ?: return

    val existingFragment = activity.supportFragmentManager
      .findFragmentByTag(root.id.toString())

    if (existingFragment == null) {
      setupLayout(root)
      val fragment = ScannerFragment()

      activity.supportFragmentManager
        .beginTransaction()
        .replace(root.id, fragment, root.id.toString())
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
    const val REACT_CLASS = "ScannerManager"
    const val COMMAND_CREATE = 1
  }
}
