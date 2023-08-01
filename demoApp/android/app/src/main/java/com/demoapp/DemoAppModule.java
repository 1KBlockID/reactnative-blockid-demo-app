package com.onekosmos.blockid.reactnative.poc;

import static com.onekosmos.blockid.reactnative.poc.AppConstants.defaultTenant;
import static com.onekosmos.blockid.reactnative.poc.AppConstants.dvcId;

import com.demoapp.ScanQRCodeActivity;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.protobuf.Any;
import com.onekosmos.blockid.sdk.cameramodule.BIDScannerView;
import com.onekosmos.blockid.sdk.cameramodule.QRCodeScanner.QRScannerHelper;
import com.onekosmos.blockid.sdk.cameramodule.camera.liveIDModule.ILiveIDResponseListener;
import com.onekosmos.blockid.sdk.cameramodule.camera.qrCodeModule.IOnQRScanResponseListener;
import com.onekosmos.blockid.sdk.cameramodule.liveID.LiveIDScannerHelper;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.google.gson.Gson;
import com.onekosmos.blockid.sdk.BIDAPIs.APIManager.ErrorManager;
import com.onekosmos.blockid.sdk.authentication.biometric.IBiometricResponseListener;
import com.onekosmos.blockid.sdk.datamodel.BIDOrigin;
import com.onekosmos.blockid.sdk.datamodel.BIDTenant;
import com.onekosmos.blockid.sdk.BlockIDSDK;
import com.onekosmos.blockid.sdk.authentication.BIDAuthProvider;
import com.onekosmos.blockid.sdk.fido2.FIDO2KeyType;
import com.onekosmos.blockid.sdk.utils.BIDUtil;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Objects;


public class DemoAppModule extends ReactContextBaseJavaModule implements ILiveIDResponseListener, IOnQRScanResponseListener {

    private final String[] K_CAMERA_PERMISSION = new String[]{Manifest.permission.CAMERA};
    private final String errorCode = "-1";
    private final String resolveMsg = "OK";

    private String BlockIdSDKVersion = null;
    private final String K_FILE_NAME = "fido3.html";
    private final BIDTenant bidTenant = defaultTenant;
    private double mLatitude = 0.0, mLongitude = 0.0;
    private LiveIDScannerHelper mLiveIDScannerHelper;
    private BIDScannerView mBIDScannerView;
    private QRScannerHelper mQRScannerHelper;
    private final BIDTenant clientTenant = com.onekosmos.blockid.reactnative.poc.AppConstants.clientTenant;
    private final String licenseKey = com.onekosmos.blockid.reactnative.poc.AppConstants.licenseKey;
    static ReactApplicationContext context;

    DemoAppModule(ReactApplicationContext context) {
        this.context = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "DemoAppModule";
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable String params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    public static void onQRScanResult(String eventName, @Nullable String params){
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
    @ReactMethod
    public void initRegistrations(Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            BlockIDSDK.getInstance().setLicenseKey(licenseKey);
        });
    }

    @ReactMethod
    public void qrLogin(Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
           loginWithQR(promise);
        });
    }



    @ReactMethod
    public void getScopeData(String scope,String creds,Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            getData(scope, creds,promise);
        });
    }

    @ReactMethod
    public void ScanQRCode(Promise promise) {
        Intent intent = new Intent(context, ScanQRCodeActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }

    @ReactMethod
    public void getSDKVersion(Promise promise) {
        BlockIdSDKVersion = BlockIDSDK.getInstance().getVersion();
        promise.resolve(BlockIdSDKVersion);
    }

    @ReactMethod
    public void getSDKInfo(Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            getTenantInfo(promise);
        });
    }

    @ReactMethod
    public void register_Tenant(Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            initWallet(promise);
        });
    }


    @ReactMethod
    public void enrollBiometricAssets(Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            if (BlockIDSDK.getInstance().isReady() && BlockIDSDK.getInstance().isDeviceAuthEnrolled()) {
                verifyBiometricData(promise);
            } else {
                enrollBiometricData(promise);
            }

        });
    }

    @ReactMethod
    public void StartLiveScan(Promise promise) {
        scanFaceId();
    }

    @ReactMethod
    public void registerUserKey(String name, Promise promise) {
        UiThreadUtil.runOnUiThread(() ->
                registerKey(name, FIDO2KeyType.PLATFORM, promise));
    }

    @ReactMethod
    public void registerCardKey(String name, Promise promise) {
        UiThreadUtil.runOnUiThread(() ->
                registerKey(name, FIDO2KeyType.CROSS_PLATFORM, promise));
    }

    @ReactMethod
    public void register(String name, Promise promise) {
        UiThreadUtil.runOnUiThread(() ->
                webRegister(name, K_FILE_NAME, promise));
    }

    @ReactMethod
    public void authenticate(String name, Promise promise) {
        UiThreadUtil.runOnUiThread(() ->
                webAuthenticate(name,K_FILE_NAME, promise));
    }

    @ReactMethod
    public void authenticateUserKey(String name, Promise promise) {
        UiThreadUtil.runOnUiThread(() ->
                authenticateKey(name, FIDO2KeyType.PLATFORM, promise));
    }

    @ReactMethod
    public void authenticateCardKey(String name, Promise promise) {
        UiThreadUtil.runOnUiThread(() ->
                authenticateKey(name, FIDO2KeyType.CROSS_PLATFORM, promise));
    }

    @ReactMethod
    public void registerTenant(Promise promise) {
        UiThreadUtil.runOnUiThread(() ->
                initWallet(promise));
    }


    @ReactMethod
    public void authenticateUser(String session, String sessionURL, String scopes, String creds,String tag,String communityName,String publicKey,String url, String authPage, Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            BIDOrigin bidOrigin = new BIDOrigin();
            bidOrigin.tag=tag;
            bidOrigin.communityName=communityName;
            bidOrigin.publicKey=publicKey;
            bidOrigin.api=url;
            bidOrigin.authPage= authPage;
            bidOrigin.community=communityName;
            authenticateUserWithData(session, sessionURL, scopes,creds, bidOrigin, promise);
        });
    }



    @ReactMethod
    public void getIsLiveIdRegister(Promise promise) {
        if (BlockIDSDK.getInstance().isLiveIDRegistered()) {
            promise.resolve("Yes");
        } else {
            promise.resolve("NO");
        }
        return;
    }

    private void enrollBiometricData(Promise promise) {
        com.onekosmos.blockid.reactnative.poc.MainActivity activity = (com.onekosmos.blockid.reactnative.poc.MainActivity) Objects.requireNonNull(context.getCurrentActivity());
        BIDAuthProvider.getInstance().enrollDeviceAuth(activity, "Device", "Bio", true, new IBiometricResponseListener() {
            @Override
            public void onBiometricAuthResult(boolean success, ErrorManager.ErrorResponse errorResponse) {
                if (success) {
                    promise.resolve(resolveMsg);
                }
            }

            @Override
            public void onNonBiometricAuth(boolean b) {
                Log.e("onNonBiometricAuth", String.valueOf(b));

            }
        });
    }
    private void getData(String scope, String creds, Promise promise) {
        var origin= new BIDOrigin();
            BlockIDSDK.getInstance().getScopes(
                    null, scope,
                   creds,
                    origin,String.valueOf(mLongitude)
                    , String.valueOf(mLatitude),
                    (linkedHashMap, errorResponse) -> {
                        if (linkedHashMap != null) {
                            Gson gson = new Gson();
                            String json = gson.toJson(linkedHashMap);
                            promise.resolve(json);
                            return;
                        }
                        else {
                            promise.resolve(errorResponse);
                        }
                    });

        //end here
    }


    private void verifyBiometricData(Promise promise) {
        com.onekosmos.blockid.reactnative.poc.MainActivity activity = (com.onekosmos.blockid.reactnative.poc.MainActivity) Objects.requireNonNull(context.getCurrentActivity());
        BIDAuthProvider.getInstance().verifyDeviceAuth(activity, "Device", "Bio", true, new IBiometricResponseListener() {
            @Override
            public void onBiometricAuthResult(boolean success, ErrorManager.ErrorResponse errorResponse) {
                if (success) {
                    promise.resolve(resolveMsg);
                }

            }

            @Override
            public void onNonBiometricAuth(boolean b) {
                Log.e("verifyBiometricData abc", String.valueOf(b));

            }
        });
    }

    private void scanFaceId() {
        mLiveIDScannerHelper = new LiveIDScannerHelper(context.getCurrentActivity(), this);
        mLiveIDScannerHelper.startLiveIDScanning();
    }

    private void loginWithQR(Promise promise) {
        mBIDScannerView = new BIDScannerView(context);
         mQRScannerHelper = new QRScannerHelper(context.getCurrentActivity(), this, mBIDScannerView);
        mQRScannerHelper.startQRScanning();
    }

    private void getTenantInfo(Promise promise) {
        BIDTenant tenant = BlockIDSDK.getInstance().getTenant();
        String dns = tenant.getDns();
        String tenantTag = tenant.getTenantTag();
        String tenantId = tenant.getTenantId();
        String community = tenant.getCommunity();
        String communityId = tenant.getCommunityId();
        BIDTenant clientTenant = com.onekosmos.blockid.reactnative.poc.AppConstants.clientTenant;
        String ClientDns = clientTenant.getDns();
        String clientTenantTag = clientTenant.getTenantTag();
        String ClientTenantId = clientTenant.getTenantId();
        String ClientCommunity = clientTenant.getCommunity();
        String ClientCommunityId = clientTenant.getCommunityId();
        String newLicenseKey = licenseKey.replace(licenseKey.substring(8, licenseKey.length() - 4), "-xxxx-xxxx-xxxx-xxxxxxxx");
        String DID = BlockIDSDK.getInstance().getDID();
        String publicKey = BlockIDSDK.getInstance().getPublicKey();
        String SdkVersion = BlockIDSDK.getInstance().getVersion();
        DataModel dataModel = new DataModel();
        dataModel.setLicenseKey(newLicenseKey);
        dataModel.setTenant(tenant);
        dataModel.setClientTenant(clientTenant);
        dataModel.setDID(DID);
        dataModel.setPublicKey(publicKey);
        dataModel.setSdkVersion(SdkVersion);
        Gson gson = new Gson();
        String json = gson.toJson(dataModel);
        promise.resolve(json);

    }

    private void initWallet(Promise promise) {
        ensureSDKUnlocked();
        SharedPreferences sharedPref = Objects.requireNonNull(context.getCurrentActivity())
                .getPreferences(Context.MODE_PRIVATE);

        if (sharedPref.getBoolean(dvcId, false)) {
            BIDAuthProvider.getInstance().lockSDK();
            promise.resolve(resolveMsg);
            return;
        }
        BIDTenant bidTenant = defaultTenant;
        BlockIDSDK.getInstance().initiateWallet();


        BlockIDSDK.getInstance().registerTenant(bidTenant, (status, error, tenant) -> {
            if (!status) {
                BIDAuthProvider.getInstance().lockSDK();
                promise.reject(String.valueOf(error.getCode()), error.getMessage());
                return;
            }
            BlockIDSDK.getInstance().commitApplicationWallet();
            BIDAuthProvider.getInstance().lockSDK();
            sharedPref.edit().putBoolean(dvcId, true).apply();
            promise.resolve(resolveMsg);
        });
    }

    private void ensureSDKUnlocked() {
        if (BIDAuthProvider.getInstance().isSDKUnLocked()) {
            return;
        }
        BIDAuthProvider.getInstance().unlockSDK();
    }

    private void authenticateUserWithData(String session, String sessionURL, String scopes, String creds, BIDOrigin origin, Promise promise) {

        BlockIDSDK.getInstance().authenticateUser(context , null, session,
                sessionURL,scopes, null, creds,
                origin, String.valueOf(mLatitude),
                String.valueOf(mLongitude), BuildConfig.VERSION_NAME,null, (status, sessionId, error) -> {
                    if (status){
                        promise.resolve(true);
                    }
                    else {
                        promise.resolve(error.getMessage());
                    }
                });
    }

    private void registerKey(String name, FIDO2KeyType type, Promise promise) {
        MainActivity activity = (MainActivity) Objects.requireNonNull(context.getCurrentActivity());
        ensureSDKUnlocked();
        BlockIDSDK.getInstance().registerFIDO2Key(
                activity,
                name,
                clientTenant.getDns(),
                clientTenant.getCommunity(),
                type,
                activity.observer,
                (status, errorResponse) -> {
                    BIDAuthProvider.getInstance().lockSDK();
                    if (errorResponse != null) {
                        promise.reject(String.valueOf(errorResponse.getCode()), errorResponse.getMessage());
                        return;
                    }
                    promise.resolve(resolveMsg);
                });
    }

    private void webRegister(String name, String fileName, Promise promise) {
        MainActivity activity = (MainActivity) Objects.requireNonNull(context.getCurrentActivity());
        ensureSDKUnlocked();
        BlockIDSDK.getInstance().registerFIDO2Key(
                activity,
                name,
                clientTenant.getDns(),
                clientTenant.getCommunity(),
                fileName,
                (status, errorResponse) -> {
                    BIDAuthProvider.getInstance().lockSDK();
                    if (errorResponse != null) {
                        promise.reject(String.valueOf(errorResponse.getCode()), errorResponse.getMessage());
                        return;
                    }

                    promise.resolve(resolveMsg);
                });
    }




    private void authenticateKey(String name, FIDO2KeyType type, Promise promise) {
        MainActivity activity = (MainActivity) Objects.requireNonNull(context.getCurrentActivity());
        ensureSDKUnlocked();

        BlockIDSDK.getInstance().authenticateFIDO2Key(
                activity,
                name,
                clientTenant.getDns(),
                clientTenant.getCommunity(),
                type,
                activity.observer,
                (status, errorResponse) -> {
                    BIDAuthProvider.getInstance().lockSDK();
                    if (errorResponse != null) {
                        promise.reject(String.valueOf(errorResponse.getCode()), errorResponse.getMessage());
                        return;
                    }
                    promise.resolve(resolveMsg);
                });


    }


    private void webAuthenticate(String name,String fileName,Promise promise) {
        com.onekosmos.blockid.reactnative.poc.MainActivity activity = (MainActivity) Objects.requireNonNull(context.getCurrentActivity());
        ensureSDKUnlocked();
        BlockIDSDK.getInstance().authenticateFIDO2Key(
                activity,
                name,
                clientTenant.getDns(),
                clientTenant.getCommunity(),
                fileName,
                (status, errorResponse) -> {
                    BIDAuthProvider.getInstance().lockSDK();
                    if (errorResponse != null) {
                        promise.reject(String.valueOf(errorResponse.getCode()), errorResponse.getMessage());
                        return;
                    }
                    promise.resolve(resolveMsg);
                });

    }


    @Override
    public void onLiveIDCaptured(Bitmap bitmap, String s, ErrorManager.ErrorResponse errorResponse) {
        sendEvent(context, "onLiveIdCapture", s);
//        BlockIDSDK.getInstance().setLiveID(livIdBitmap, null, null,
//                (status, message, error) -> {

    }

    @Override
    public void onFaceFocusChanged(boolean b, String s) {
        Log.d("onFaceFocusChanged", "" + s);
    }

    @Override
    public void expressionDidReset(String s) {
        Log.d("expressionDidReset", "" + s);
    }

    @Override
    public void onLivenessCheckStarted() {
        Log.d("onLivenessCheckStarted", "onLivenessCheckStarted");
    }

    @Override
    public void onQRScanResultResponse(String s) {

    }
}