package com.blockidplugin

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Handler
import android.os.Looper
import android.text.TextUtils
import android.util.Base64
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.onekosmos.blockid.sdk.BIDAPIs.APIManager.ErrorManager
import com.onekosmos.blockid.sdk.BIDAPIs.APIManager.ErrorManager.ErrorResponse
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
import com.onekosmos.blockid.sdk.document.BIDDocumentProvider.RegisterDocCategory
import com.onekosmos.blockid.sdk.document.RegisterDocType
import com.onekosmos.blockid.sdk.documentScanner.BIDDocumentDataHolder
import com.onekosmos.blockid.sdk.documentScanner.DocumentScannerActivity
import com.onekosmos.blockid.sdk.documentScanner.DocumentScannerType
import com.onekosmos.blockid.sdk.totp.TOTP
import com.onekosmos.blockid.sdk.utils.BIDUtil
import org.json.JSONArray
import org.json.JSONObject


class BlockidpluginModule internal constructor(context: ReactApplicationContext) :
  BlockidpluginSpec(context) {

  private var mLiveIDScannerHelper: LiveIDScannerHelper? = null
  private var activity: FragmentActivity? = null
  private var docScanPromise: Promise? = null
  private var mQRScannerHelper: QRScannerHelper? = null
  private var context: ReactApplicationContext? = null


  private val activityEventListener =
    object : BaseActivityEventListener() {
      override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        intent: Intent?
      ) {
        if (requestCode == DOC_SCAN_REQUEST) {
          docScanPromise?.let { promise ->
            if (resultCode == Activity.RESULT_CANCELED) {
              if (intent != null) {
               val error: ErrorManager.ErrorResponse?
               val errorString = intent.getStringExtra("K_DOCUMENT_SCAN_ERROR")
               error = BIDUtil.JSONStringToObject(errorString, ErrorManager.ErrorResponse::class.java)
               promise.reject(error?.code?.toString() ?: "0", error?.message ?: "")
            } else {
               promise.reject( "0", "Document Scan Failed")
            }
          } else if (BIDDocumentDataHolder.hasData()) {
              promise.resolve(BIDDocumentDataHolder.getData())
          } else {
              promise.reject( "0", "Document Scan Failed")
          }
            docScanPromise = null
          }
        }
      }
    }

  override fun getName(): String {
    return NAME
  }

  init {
    BlockIDSDK.initialize(context)
    this.context = context
    context.addActivityEventListener(activityEventListener)
  }

  @ReactMethod
  override fun blockIDSDKVerion(promise: Promise) {
    promise.resolve(BlockIDSDK.getInstance().version)
  }

  @ReactMethod
  override fun getDID(promise: Promise) {
    promise.resolve(BlockIDSDK.getInstance().did)
  }

  @ReactMethod
  override fun lockSDK(promise: Promise) {
    BIDAuthProvider.getInstance().lockSDK()
    promise.resolve(true)
  }

  @ReactMethod
  override fun unLockSDK(promise: Promise) {
    BIDAuthProvider.getInstance().unlockSDK()
    promise.resolve(true)
  }

  @ReactMethod
  override fun setLicenseKey(licenseKey: String, promise: Promise){
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
      if (status) {
        BlockIDSDK.getInstance().commitApplicationWallet()
        promise.resolve(true)
      } else {
        promise.reject(error?.message ?: "", "")
      }
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
            promise.resolve(b)
          }
          override fun onBiometricAuthResult(success: Boolean, errorResponse: ErrorManager.ErrorResponse?) {
            promise.resolve(success)
          }
        }
      )
    }
  }

  @ReactMethod
  override fun isDeviceAuthRegisterd(promise: Promise){
    promise.resolve(BlockIDSDK.getInstance().isDeviceAuthEnrolled)
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
            promise.resolve(success)
          }

          override fun onNonBiometricAuth(success: Boolean) {
            promise.resolve(success)
          }
        }
      )
    }
  }

  @ReactMethod
  override fun totp(promise: Promise){
    val response = BlockIDSDK.getInstance().totp
    if (response.status) {
      val totp = response.getDataObject<TOTP>()
      if (totp != null) {
        val resultMap = WritableNativeMap().apply {
          putString("totp", totp.otp)
          putInt("getRemainingSecs", totp.remainingSecs.toInt())
        }
        promise.resolve(resultMap)
      } else{
        promise.reject(response?.errorResponse?.message ?: "", "")
      }
    } else{
      promise.reject(response?.errorResponse?.message ?: "", "")
    }
  }

  @ReactMethod
  override fun isLiveIDRegisterd(promise: Promise){
    val response = BlockIDSDK.getInstance().isLiveIDRegistered
    promise.resolve(response)
  }

  private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  @ReactMethod
  override fun enrollLiveIDScanning(dvcID: String, promise: Promise) {
    performLiveIDScanning(dvcID, LiveIDAction.REGISTRATION, promise)
  }

  private fun performLiveIDScanning(dvcID: String, action: LiveIDAction, promise: Promise) {
    UiThreadUtil.runOnUiThread {
      mLiveIDScannerHelper?.stopLiveIDScanning()
      mLiveIDScannerHelper = null
      mLiveIDScannerHelper = LiveIDScannerHelper(
        currentActivity!!,
        ScannerViewRef.bidScannerView!!,
        null,
        object : ILiveIDResponseListener {
          override fun onLiveIDCaptured(
            p0: Bitmap?,
            p1: String?,
            p2: String?,
            p3: ErrorManager.ErrorResponse?
          ) {
            if (p0 != null && p1 != null) {
              when (action) {
                LiveIDAction.REGISTRATION -> registerLiveID(p0, p1, p2)
                LiveIDAction.VERIFICATION -> verifyLiveID(p0, p1, p2)
              }
            } else {
              val params = Arguments.createMap().apply {
                putString("status", "failed")
                putMap("error", Arguments.createMap().apply {
                  putInt("code", p3?.code ?: -1)
                  putString("description", p3?.message)
                })
              }
              sendEvent(context!!, "onStatusChanged", params)
            }
          }

          override fun onLivenessCheckStarted() {
            activity?.runOnUiThread {
              mLiveIDScannerHelper?.stopLiveIDScanning()
            }
            val params = Arguments.createMap().apply {
              putString("status", "faceLivenessCheckStarted")
            }
            sendEvent(context!!, "onStatusChanged", params)
          }

          override fun onFaceFocusChanged(isFocused: Boolean, message: String?, errorResponse: ErrorResponse?) {
            val params = Arguments.createMap().apply {
              putString("status", "focusOnFaceChanged")

              val info = Arguments.createMap()
              info.putBoolean("isFocused", isFocused)
              info.putString("message", message ?: "")

              putMap("info", info)
            }
            sendEvent(context!!, "onStatusChanged", params)
          }
        })
      mLiveIDScannerHelper?.startLiveIDScanning(dvcID)
    }
  }

  private fun registerLiveID(p0: Bitmap, p1: String, p2: String?) {
    BlockIDSDK.getInstance().setLiveID(
      p0, null, p1,
      p2
    ) { status: Boolean, message: String?, errorResponse: ErrorResponse? ->
      if (status) {
        val params = Arguments.createMap().apply {
          putString("status", "completed")
        }
        sendEvent(context!!, "onStatusChanged", params)
      } else {
        val params = Arguments.createMap().apply {
          putString("status", "failed")
          putMap("error", Arguments.createMap().apply {
            putInt("code", errorResponse?.code ?: -1)
            putString("description", errorResponse?.message)
          })
        }
        sendEvent(context!!, "onStatusChanged", params)
      }
    }
  }

  private fun verifyLiveID(p0: Bitmap, p1: String, p2: String?) {
    BlockIDSDK.getInstance().verifyLiveID(
      context!!, p0, p1, p2) { status: Boolean, errorResponse: ErrorResponse? ->
        if (status) {
          val params = Arguments.createMap().apply {
            putString("status", "completed")
          }
          sendEvent(context!!, "onStatusChanged", params)
        } else {
          val params = Arguments.createMap().apply {
            putString("status", "failed")
            putMap("error", Arguments.createMap().apply {
              putInt("code", errorResponse?.code ?: -1)
              putString("description", errorResponse?.message)
            })
           }
          sendEvent(context!!, "onStatusChanged", params)
        }
      }
  }

  @ReactMethod
  override fun verifyLiveIDScanning(dvcID: String, promise: Promise) {
    performLiveIDScanning(dvcID, LiveIDAction.VERIFICATION, promise)
  }

  @ReactMethod
  override fun stopLiveIDScanning(promise: Promise){
      mLiveIDScannerHelper?.stopLiveIDScanning()
      promise.resolve(true)
  }

  @ReactMethod
  override fun resetSDK(tag: String, community: String, dns: String, licenseKey: String, reason: String, promise: Promise){
    Handler(Looper.getMainLooper()).post {
      val bidTenant = BIDTenant(tag, community, dns)
      BlockIDSDK.getInstance().resetSDK(licenseKey, bidTenant, reason)
      promise.resolve(true)
    }
  }

  @ReactMethod
  override fun startQRScanning(promise: Promise) {
    Handler(Looper.getMainLooper()).post {
      mQRScannerHelper?.stopQRScanning()
      mQRScannerHelper = null

      mQRScannerHelper =  QRScannerHelper(currentActivity, object: IOnQRScanResponseListener{
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
      },  ScannerViewRef.bidScannerView!!)
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
  override fun getScopesAttributesDic(data: ReadableMap, promise: Promise){
    val bidOrigin = bidOrigin(data)

    BlockIDSDK.getInstance().getScopes(null, data.getString("scopes") ?: "", data.getString("creds") ?: "", bidOrigin, "0", "0") { linkedHashMap, errorResponse ->
      if (linkedHashMap != null) {
        val convertedMap = convertToReadableMap(linkedHashMap)
        promise.resolve(convertedMap)
      } else {
        promise.reject(errorResponse?.code?.toString() ?: "0", errorResponse?.message ?: "", null)
      }
    }
  }

  @ReactMethod
  override fun authenticateUserWithScopes(data: ReadableMap, promise: Promise){
    context?.let {
      BlockIDSDK.getInstance().authenticateUser(
        it, null,
        data.getString("session") ?: "", data.getString("sessionUrl") ?: "",
        data.getString("scopes") ?: "", null, data.getString("creds") ?: "",
          bidOrigin(data), "0",
        "0", BlockIDSDK.getInstance().version, null, "" //pass auth type here
    ) { status: Boolean, _, error: ErrorManager.ErrorResponse? ->
        if (status) {
          promise.resolve(true)
        } else {
          promise.reject(error?.code?.toString() ?: "0", error?.message ?: "", null)
        }
    }
    }
  }


  @ReactMethod
  override fun getUserDocument(type: Double, promise: Promise){
    val docType = BIDocType.from(type.toInt())
    val strDocuments = BIDDocumentProvider.getInstance().getUserDocument(null,docType?.type,
      docType?.category)
    promise.resolve(strDocuments)
  }

  @ReactMethod
  override fun scanDocument(type: Double, promise: Promise){
    val docType = BIDocType.from(type.toInt())
    if (docType == null) {
      promise.reject( "Error", "Document type not supported", null)
      return
    }
    docScanPromise = promise

    val intent = Intent( reactApplicationContext , DocumentScannerActivity::class.java).apply {
      putExtra("K_DOCUMENT_SCAN_TYPE", docType.docScannerType.value)
    }
//    documentSessionResult.launch(intent)
    currentActivity?.startActivityForResult(intent, DOC_SCAN_REQUEST)
  }


  @ReactMethod
  override fun registerNationalIDWithLiveID(
    data: ReadableMap?,
    face: String?,
    proofedBy: String?,
    promise: Promise?
  ) {
    val image = faceData(face)
    if (data != null && proofedBy != null && image != null) {
      val obj = convertReadableMapToLinkedHashMap(data)
      obj["category"] = RegisterDocCategory.identity_document.name
      obj["type"] = RegisterDocType.NATIONAL_ID.value
      registerDocument(obj, proofedBy, image, promise)
    } else {
      promise?.reject("Error", "obj, proofedBy, faceData mandatory")
      return
    }
  }

  @ReactMethod
  override fun registerDrivingLicenceWithLiveID(
    data: ReadableMap?,
    face: String?,
    proofedBy: String?,
    promise: Promise?
  ) {
    val image = faceData(face)
    if (data != null && proofedBy != null && image != null) {
      val obj = convertReadableMapToLinkedHashMap(data)
      obj["category"] = RegisterDocCategory.identity_document.name
      obj["type"] = RegisterDocType.DL.value
      registerDocument(obj, proofedBy, image, promise)
    } else {
      promise?.reject("Error", "obj, proofedBy, faceData mandatory")
      return
    }
  }

  @ReactMethod
  override fun registerPassportWithLiveID(
    data: ReadableMap?,
    face: String?,
    proofedBy: String?,
    promise: Promise?
  ) {
    val image = faceData(face)
    if (data != null && proofedBy != null && image != null) {
      val obj = convertReadableMapToLinkedHashMap(data)
      obj["category"] = RegisterDocCategory.identity_document.name
      obj["type"] = RegisterDocType.PPT.value
      registerDocument(obj, proofedBy, image, promise)
    } else {
      promise?.reject("Error", "obj, proofedBy, faceData mandatory")
      return
    }
  }

  @ReactMethod
  fun addListener(type: String?) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  @ReactMethod
  fun removeListeners(type: Int?) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  private fun registerDocument(obj: LinkedHashMap<String, Any>, proofedBy: String, img: Bitmap, promise: Promise?) {
    BlockIDSDK.getInstance().registerDocument(activity,
      obj,
      img,
      proofedBy,
      null,
      null
    ) { p0, p1 ->
      if (p0) {
        promise?.resolve(true)
      } else {
        promise?.reject(p1?.code?.toString() ?: "0", p1?.message ?: "")
      }
    }
  }

  private fun convertToReadableMap(linkedHashMap: LinkedHashMap<String, Any>): WritableMap {
    val writableMap = Arguments.createMap()

    for ((key, value) in linkedHashMap) {
      when (value) {
        is JSONObject -> writableMap.putMap(key, jsonToWritableMap(value))
        is String -> writableMap.putString(key, value)
        is Int -> writableMap.putInt(key, value)
        is Double -> writableMap.putDouble(key, value)
        is Boolean -> writableMap.putBoolean(key, value)
        // Handle other types as needed
        else -> writableMap.putString(key, value.toString())
      }
    }

    return writableMap
  }

  private fun convertReadableMapToLinkedHashMap(readableMap: ReadableMap): LinkedHashMap<String, Any> {
    val map = LinkedHashMap<String, Any>()

    val iterator = readableMap.keySetIterator()
    while (iterator.hasNextKey()) {
      val key = iterator.nextKey()
      when (readableMap.getType(key)) {
        ReadableType.Null -> map[key] = "null"
        ReadableType.Boolean -> map[key] = readableMap.getBoolean(key)
        ReadableType.Number -> map[key] = readableMap.getDouble(key)
        ReadableType.String -> map[key] = readableMap.getString(key) ?: "null"
        ReadableType.Map -> readableMap.getMap(key)?.let {
          map[key] = convertReadableMapToLinkedHashMap(it)
        } ?: run {
          map[key] = "null"
        }
        ReadableType.Array -> readableMap.getArray(key)?.let {
          map[key] = it.toArrayList()
        } ?: run {
          map[key] = emptyList<Any>()
        }
        else -> throw IllegalArgumentException("Unsupported type for key: $key")
      }
    }
    return map
  }
  private fun faceData(data: String?): Bitmap? {
    if (data == null) {
      return null
    }
    return convertBase64ToBitmap(data)
  }

  private fun convertBase64ToBitmap(img: String): Bitmap? {
    if (TextUtils.isEmpty(img)) {
      return null
    }
    val decodedString = Base64.decode(img, Base64.DEFAULT)
    return BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
  }

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

  private fun jsonToWritableMap(jsonObject: JSONObject): WritableMap {
    val map = Arguments.createMap()
    val keys = jsonObject.keys()

    while (keys.hasNext()) {
      val key = keys.next()
      val value = jsonObject.get(key)

      when (value) {
        is JSONObject -> map.putMap(key, jsonToWritableMap(value)) // Recursive conversion for nested JSONObjects
        is JSONArray -> map.putArray(key, jsonToWritableArray(value)) // Convert JSONArray to WritableArray
        is String -> map.putString(key, value)
        is Int -> map.putInt(key, value)
        is Double -> map.putDouble(key, value)
        is Boolean -> map.putBoolean(key, value)
        // Handle other types as needed
        else -> map.putString(key, value.toString())
      }
    }

    return map
  }

  private fun jsonToWritableArray(jsonArray: JSONArray): WritableArray {
    val array = Arguments.createArray()

    for (i in 0 until jsonArray.length()) {
      val value = jsonArray.get(i)

      when (value) {
        is JSONObject -> array.pushMap(jsonToWritableMap(value)) // Recursive conversion for nested JSONObjects
        is JSONArray -> array.pushArray(jsonToWritableArray(value)) // Recursive conversion for nested JSONArrays
        is String -> array.pushString(value)
        is Int -> array.pushInt(value)
        is Double -> array.pushDouble(value)
        is Boolean -> array.pushBoolean(value)
        // Handle other types as needed
        else -> array.pushString(value.toString())
      }
    }

    return array
  }

  enum class BIDocType(val value: Int) {
    NATIONAL_ID(1),
    DRIVING_LICENCE(2),
    PASSPORT(3);

    val type: String
      get() = when (this) {
        NATIONAL_ID -> RegisterDocType.NATIONAL_ID.value
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
      get() = RegisterDocCategory.identity_document.name

    companion object {
      fun from(value: Int): BIDocType? {
        return values().find { it.value == value }
      }
    }
  }

  companion object {
    const val NAME = "Blockidplugin"
    const val DOC_SCAN_REQUEST = 1
  }

  private enum class LiveIDAction {
    REGISTRATION,
    VERIFICATION
  }
}
