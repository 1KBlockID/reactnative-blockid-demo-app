package com.blockidplugin

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.os.Handler
import android.os.Looper
import android.widget.LinearLayout
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.widget.AppCompatImageView
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.onekosmos.blockid.sdk.BIDAPIs.APIManager.ErrorManager
import com.onekosmos.blockid.sdk.BlockIDSDK
import com.onekosmos.blockid.sdk.authentication.BIDAuthProvider
import com.onekosmos.blockid.sdk.authentication.biometric.IBiometricResponseListener
import com.onekosmos.blockid.sdk.cameramodule.QRCodeScanner.QRScannerHelper
import com.onekosmos.blockid.sdk.cameramodule.camera.liveIDModule.ILiveIDResponseListener
import com.onekosmos.blockid.sdk.cameramodule.camera.qrCodeModule.IOnQRScanResponseListener
import com.onekosmos.blockid.sdk.cameramodule.liveID.LiveIDScannerHelper
import com.onekosmos.blockid.sdk.datamodel.AccountAuthConstants
import com.onekosmos.blockid.sdk.datamodel.BIDOrigin
import com.onekosmos.blockid.sdk.datamodel.BIDTenant
import com.onekosmos.blockid.sdk.document.BIDDocumentProvider
import com.onekosmos.blockid.sdk.document.RegisterDocType
import com.onekosmos.blockid.sdk.documentScanner.BIDDocumentDataHolder
import com.onekosmos.blockid.sdk.documentScanner.DocumentScannerActivity
import com.onekosmos.blockid.sdk.documentScanner.DocumentScannerType
import com.onekosmos.blockid.sdk.totp.TOTP
import com.onekosmos.blockid.sdk.utils.BIDUtil
import org.json.JSONObject

class BlockidpluginModule internal constructor(context: ReactApplicationContext) :
  NativeBlockidpluginSpec(context) {
  private var mLiveIDScannerHelper: LiveIDScannerHelper? = null
  private lateinit var documentSessionResult: ActivityResultLauncher<Intent>
  private var activities: FragmentActivity? = null
  private val factory: FlNativeViewFactory = FlNativeViewFactory()
  private val promise: Promise? = null
  private var mQRScannerHelper: QRScannerHelper? = null
  private var context: Context ?= null
//  private val mActivityEventListener = object : BaseActivityEventListener() {
//    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
//      val result = ActivityResult(resultCode, data)
//      documentSessionResult = activities!!.registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
//        handleDocumentSessionResult(result)
//      }
//    }
//  }

  override fun getName(): String {
    return NAME
  }

  init {
//    context.addActivityEventListener(mActivityEventListener)
      BlockIDSDK.initialize(context)
  }



  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  override fun setLicenseKey(licenseKey: String,promise: Promise){
    Handler(Looper.getMainLooper()).post {
      BlockIDSDK.getInstance().setLicenseKey(licenseKey)
      promise.resolve(true)
    }
  }

  @ReactMethod
  override fun isReady(promise: Promise){
    promise.resolve(BlockIDSDK.getInstance().isReady)
  }

  @ReactMethod
  override fun initiateTempWallet(promise: Promise){
    BlockIDSDK.getInstance().initiateWallet()
    promise.resolve(true)
  }

  @ReactMethod
  override fun registerTenantWith(tag: String, community: String,dns: String ,promise: Promise){
    val bidTenant = BIDTenant(tag,community,dns)
    BlockIDSDK.getInstance().registerTenant(bidTenant) { status, error, _ ->
      if(status && error != null){
        promise.reject("Error", error.message)
      }
      BlockIDSDK.getInstance().commitApplicationWallet()
      promise.resolve(true)
    }
  }

  @ReactMethod
  override fun enrollDeviceAuth(promise: Promise){
    Handler(Looper.getMainLooper()).post{
      BIDAuthProvider.getInstance().enrollDeviceAuth(
        currentActivity,
        "Biometric authentication",
        "Do you want to allow this app to use biometric authentication?",
        false,
        object : IBiometricResponseListener {
          override fun onNonBiometricAuth(b: Boolean) {
            val resultMap: WritableMap = WritableNativeMap()
            resultMap.putBoolean("status",b)
            promise.resolve(resultMap)
          }
          override fun onBiometricAuthResult(success: Boolean, errorResponse: ErrorManager.ErrorResponse?) {
            val resultMap: WritableMap = WritableNativeMap()
            resultMap.putBoolean("status",success)
            promise.resolve(resultMap)
          }
        }
      )
    }
  }

  @ReactMethod
  override fun isDeviceAuthRegisterd(promise: Promise){
    promise.resolve(BlockIDSDK.getInstance().isDeviceAuthEnrolled())
  }

  @ReactMethod
  override fun verifyDeviceAuth(promise: Promise){
    Handler(Looper.getMainLooper()).post {
      BIDAuthProvider.getInstance().verifyDeviceAuth(
        currentActivity,
        "Biometric authentication",
        "Biometric authentication required to proceed",
        false,
        object : IBiometricResponseListener {
          override fun onBiometricAuthResult(success: Boolean, error: ErrorManager.ErrorResponse?) {
            val resultMap: WritableMap = Arguments.createMap()
            resultMap.putBoolean("status", success)
            promise.resolve(resultMap)
          }

          override fun onNonBiometricAuth(success: Boolean) {
            val resultMap: WritableMap = Arguments.createMap()
            resultMap.putBoolean("status", success)
            promise.resolve(resultMap)
          }
        }
      )
    }
  }

  @ReactMethod
  override fun totp(promise: Promise){
    val response = BlockIDSDK.getInstance().totp
    if(response.status){
      val totp = response.getDataObject<TOTP>()
      if (totp != null){
        val resultMap = WritableNativeMap().apply {
          putString("totp",totp.otp)
          putInt("getRemainingSecs",totp.remainingSecs.toInt())
        }
        promise.resolve(resultMap)
      }else{
        promise.resolve(null)
      }
    }else{
      promise.resolve(null)
    }
  }

  @ReactMethod
  override fun isLiveIDRegisterd(promise: Promise){
    val response = BlockIDSDK.getInstance().isLiveIDRegistered
    promise.resolve(response)
  }

  @ReactMethod
  override fun startLiveIDScanning(dvcID: String,promise: Promise){
   val currentactivity = activities
  }

  @ReactMethod
  override fun stopLiveIDScanning(promise: Promise){
      mLiveIDScannerHelper?.stopLiveIDScanning()
      promise.resolve(true)
  }

  @ReactMethod
  override fun resetSDK(tag: String,community: String,dns: String,licenseKey: String,reason: String ,promise: Promise){
    Handler(Looper.getMainLooper()).post {
      val bidTenant = BIDTenant(tag, community, dns)
      BlockIDSDK.getInstance().resetSDK(licenseKey, bidTenant, reason)
      promise.resolve(true)
    }
  }

  @ReactMethod
  override fun getUserDocument(type: Double,promise: Promise){
    val docType = BIDocType.from(type.toInt())
    val strDocuments = BIDDocumentProvider.getInstance().getUserDocument(null,docType?.type,
      docType?.category)
    println("strDocuments ---> $strDocuments")
    println("strDocuments1 ---> ${docType?.type}")
    println("strDocuments2 ---> ${docType?.category}")
      promise.resolve(strDocuments)
  }

  @ReactMethod
  override fun scanDocument(type: Double,promise: Promise){
    val docType = BIDocType.from(type.toInt())
    if (docType == null) {
      promise.reject( "Error", "Document type not supported", null)
      return
    }
    val intent = Intent( reactApplicationContext , DocumentScannerActivity::class.java).apply {
      putExtra("K_DOCUMENT_SCAN_TYPE", docType.docScannerType.value)
    }
    documentSessionResult.launch(intent)
  }

  @ReactMethod
  override fun registerNationalIDWithLiveID(data: ReadableMap,promise: Promise){}

  @ReactMethod
  override fun startQRScanning(promise: Promise){
    Handler(Looper.getMainLooper()).post {
      if (mQRScannerHelper?.isRunning == true) {
        mQRScannerHelper?.stopQRScanning()
        mQRScannerHelper = null
      }
      mQRScannerHelper =  QRScannerHelper(activities, object: IOnQRScanResponseListener{
        override fun onQRScanResultResponse(p0: String?) {
          mQRScannerHelper?.stopQRScanning()
          p0?.let {
            promise.resolve(p0)
          } ?: run {
           promise.reject(
                  "Error",
                  "QRScan Failed",
                  null
                )
          }
        }
      },factory.nativeView!!.bidScannerView)
      mQRScannerHelper?.startQRScanning()
    }
  }

  @ReactMethod
  override fun stopQRScanning(promise: Promise){
    Handler(Looper.getMainLooper()).post {
      mQRScannerHelper?.stopQRScanning()
      promise.resolve(true)
    }
  }

  @ReactMethod
  override fun isUrlTrustedSessionSources(url: String,promise: Promise){
    promise.resolve(BlockIDSDK.getInstance().isTrustedSessionSource(url))
  }

  @ReactMethod
  override fun getScopesAttributesDic(data: ReadableMap,promise: Promise){
    val bidOrigin = bidOrigin(data)
    BlockIDSDK.getInstance().getScopes(null, data.getString("scopes") ?: "", data.getString("creds") ?: "", bidOrigin, "0", "0"
    ) { linkedHashMap, errorResponse ->
      if (linkedHashMap != null) {
        val convertedMap = linkedHashMap.mapValues { entry ->
          when (val value = entry.value) {
            is JSONObject -> jsonToMap(value)
            else -> value
          }
        }
        promise.resolve(convertedMap)
      } else {
        promise.reject(errorResponse?.code?.toString() ?: "0", errorResponse?.message ?: "", null)
      }
    }
  }

  @ReactMethod
  override fun authenticateUserWithScopes(data: ReadableMap,promise: Promise){
    context?.let {
      BlockIDSDK.getInstance().authenticateUser(
        it, null,
        data.getString("session") ?: "", data.getString("sessionUrl") ?: "",
        data.getString("scopes") ?: "", null, data.getString("creds") ?: "",
          bidOrigin(data), "0",
        "0", BlockIDSDK.getInstance().version, null, "" //pass auth type here
    ) { status: Boolean, sessionId: String?, error: ErrorManager.ErrorResponse? ->
        if (status) {
          promise.resolve(status)
        } else {
          promise.reject(error?.code?.toString() ?: "0", error?.message ?: "", null)
        }
    }
    }
  }

  @ReactMethod
  override fun registerDrivingLicenceWithLiveID(data: ReadableMap,promise: Promise){}

  @ReactMethod
  override fun registerPassportWithLiveID(data: ReadableMap,promise: Promise){}

  private  fun bidOrigin(data: ReadableMap): BIDOrigin {
    val bidOrigin = BIDOrigin()
    bidOrigin.api = data.getString("api") ?: ""
    bidOrigin.tag = data.getString("tag") ?: ""
    bidOrigin.name = data.getString("name") ?: ""
    bidOrigin.community = data.getString("community") ?: ""
    bidOrigin.publicKey = data.getString("publicKey") ?: ""
    bidOrigin.session = data.getString("session") ?: ""
    bidOrigin.authPage = data.getString("authPage") ?:  AccountAuthConstants.K_NATIVE_AUTH_SCHEMA
    return bidOrigin
  }

  fun jsonToMap(jsonObject: JSONObject): Map<String, Any?> {
    val map = mutableMapOf<String, Any?>()
    val keys = jsonObject.keys()
    while (keys.hasNext()) {
      val key = keys.next()
      val value = jsonObject.get(key)
      map[key] = when (value) {
        is JSONObject -> jsonToMap(value) // Recursive conversion for nested JSONObjects
        is org.json.JSONArray -> {
          val list = mutableListOf<Any?>()
          for (i in 0 until value.length()) {
            list.add(value.get(i))
          }
          list
        }
        else -> value
      }
    }
    return map
  }

  enum class BIDocType(val value: Int) {
    NATIONAL_ID(1),
    DRIVING_LICENCE(2),
    PASSPORT(3);

    val type: String
      get() = when (this) {
        NATIONAL_ID -> "NATIONAL_ID"
        DRIVING_LICENCE -> RegisterDocType.DL.value
        PASSPORT -> RegisterDocType.PPT.value
      }

    val docScannerType: DocumentScannerType
      get() = when (this) {
        NATIONAL_ID -> DocumentScannerType.IDCARD
        DRIVING_LICENCE -> DocumentScannerType.DL
        PASSPORT -> DocumentScannerType.PPT
      }

    val category: String
      get() = when (this) {
        else ->  BIDDocumentProvider.RegisterDocCategory.identity_document.name
      }

    companion object {
      fun from(value: Int): BIDocType? {
        return values().find { it.value == value }
      }
    }
  }

  private fun handleDocumentSessionResult(activityResult: ActivityResult) {
    if (activityResult.resultCode == Activity.RESULT_CANCELED) {
      val error: ErrorManager.ErrorResponse?
      val data = activityResult.data
      if (data != null) {
        val errorString = data.getStringExtra("K_DOCUMENT_SCAN_ERROR")
        error = BIDUtil.JSONStringToObject(errorString, ErrorManager.ErrorResponse::class.java)
        promise?.reject(error?.code?.toString() ?: "0", error?.message ?: "", null)
      } else {
        promise?.reject("0", "Document Scan Failed", null)
      }
    } else if (BIDDocumentDataHolder.hasData()) {
     promise?.resolve(BIDDocumentDataHolder.getData())
    } else {
      promise?.reject("0", "Document Scan Failed", null)
    }
  }

  enum class LiveIDResponseStatus(val raw: Int) {
    FOCUS_ON_FACE_CHANGED(0),
    FACE_LIVENESS_CHECK_STARTED(1),
    COMPLETED(2),
    FAILED(3);

    companion object {
      fun ofRaw(raw: Int): LiveIDResponseStatus? {
        return values().firstOrNull { it.raw == raw }
      }
    }
  }

  companion object {
    const val NAME = "Blockidplugin"
  }
}
