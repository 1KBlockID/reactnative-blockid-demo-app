package com.onekosmos.blockid.reactnative.poc;

import static com.onekosmos.blockid.sdk.BIDAPIs.APIManager.ErrorManager.CustomErrors.K_CONNECTION_ERROR;

import android.content.DialogInterface;
import android.os.Bundle;
import android.util.Base64;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatImageView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.onekosmos.blockid.sdk.BlockIDSDK;
import com.onekosmos.blockid.sdk.cameramodule.BIDScannerView;
import com.onekosmos.blockid.sdk.cameramodule.QRCodeScanner.QRScannerHelper;
import com.onekosmos.blockid.sdk.cameramodule.camera.qrCodeModule.IOnQRScanResponseListener;

/**
 * Created by 1Kosmos Engineering
 * Copyright © 2023 1Kosmos. All rights reserved.
 */
public class ScanQRCodeActivity extends AppCompatActivity implements IOnQRScanResponseListener {
    private ProgressBar mProgressBar;
    private QRScannerHelper mQRScannerHelper;
    private BIDScannerView mBIDScannerView;
    private RelativeLayout mScannerOverlay;
    private LinearLayout mScannerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scan_qrcode);
        initView();
    }

    @Override
    public void onStart() {
        super.onStart();
        mBIDScannerView.setVisibility(View.VISIBLE);
        mScannerOverlay.setVisibility(View.VISIBLE);
        mQRScannerHelper = new QRScannerHelper(this, this,
                mBIDScannerView);
        mQRScannerHelper.startQRScanning();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        setResult(RESULT_CANCELED);
        finish();
    }

    @Override
    public void onQRScanResultResponse(String qrCodeData) {
        if (mQRScannerHelper.isRunning()) {
            mQRScannerHelper.stopQRScanning();
            runOnUiThread(() -> onQRCodeScanResponse(qrCodeData));
        }
    }

    private void initView() {
        mScannerView = findViewById(R.id.scanner_view);
        mBIDScannerView = findViewById(R.id.bid_scanner_view);
        mScannerOverlay = findViewById(R.id.scanner_overlay);
        mBIDScannerView.setScannerWidthMargin(50, mScannerOverlay);
        mProgressBar = findViewById(R.id.progress_bar_register);

        AppCompatImageView mImgBack = findViewById(R.id.img_back_scan_qr);
        mImgBack.setOnClickListener(view -> onBackPressed());
    }

    private void onQRCodeScanResponse(String qrResponse) {
        mBIDScannerView.setVisibility(View.INVISIBLE);
        mScannerOverlay.setVisibility(View.INVISIBLE);
        mScannerView.setVisibility(View.INVISIBLE);
        mProgressBar.setVisibility(View.VISIBLE);
        processQRData(qrResponse);
    }

    private void processQRData(String qrCodeData) {
        AlertDialog.Builder builder = new AlertDialog.Builder(ScanQRCodeActivity.this);
        builder.setTitle(getString(R.string.label_error));
        builder.setCancelable(false);
        // UWL 2
        if (qrCodeData.startsWith("https://") && qrCodeData.contains("/sessions/session/")) {
            String[] sessionDetails = qrCodeData.split("/session/");
            if (!BlockIDSDK.getInstance().isTrustedSessionSource(sessionDetails[0])) {
                builder.setTitle(getString(R.string.label_error));
                builder.setMessage(getString(R.string.label_suspicious_qr_code));
                builder.setPositiveButton("Cancel", (DialogInterface.OnClickListener) (dialog, which) -> {
                    finish();
                });

                AlertDialog alertDialog = builder.create();
                alertDialog.show();
                return;
            }
            GetSessionDataAPI.getInstance().getSessionData(qrCodeData, (status, response, error) -> {
                //hide
                if (!status) {

                    if (error.getCode() == K_CONNECTION_ERROR.getCode()) {
                        builder.setTitle(getString(R.string.label_your_are_offline));
                        builder.setMessage(getString(R.string.label_please_check_your_internet_connection));
                        builder.setPositiveButton("Cancel", (DialogInterface.OnClickListener) (dialog, which) -> {
                            finish();
                        });
                        AlertDialog alertDialog = builder.create();
                        alertDialog.show();
                        return;
                    }

                    builder.setMessage("Requested session is no longer available.");
                    builder.setPositiveButton("Cancel", (DialogInterface.OnClickListener) (dialog, which) -> {
                        finish();
                    });
                    AlertDialog alertDialog = builder.create();
                    alertDialog.show();
                    return;
                }
                Gson gson = new GsonBuilder().disableHtmlEscaping().create();
                try {

                    AuthenticationPayloadV2 authenticationPayloadV2 = gson.fromJson(response,
                            AuthenticationPayloadV2.class);
                    String json = gson.toJson(authenticationPayloadV2);
                    processScope(authenticationPayloadV2.getAuthRequestModel(qrCodeData));
                } catch (Exception e) {
                    builder.setMessage(getString(R.string.label_error));
                    builder.setPositiveButton("Cancel", (DialogInterface.OnClickListener) (dialog, which) -> {
                        finish();
                    });
                    AlertDialog alertDialog = builder.create();
                    alertDialog.show();
                }
            });
        } else {
            try {
                String qrResponseString = new String(Base64.decode(qrCodeData, Base64.NO_WRAP));
                processScope(new Gson().fromJson(qrResponseString, AuthenticationPayloadV1.class));
            } catch (Exception e) {
                builder.setMessage(getString(R.string.label_error));
                builder.setPositiveButton("okay", (DialogInterface.OnClickListener) (dialog, which) -> {
                    finish();
                });
                AlertDialog alertDialog = builder.create();
                alertDialog.show();
            }
        }
    }

    private void processScope(AuthenticationPayloadV1 authenticationPayloadV1) {
        Gson gson1 = new Gson();
        String json = gson1.toJson(authenticationPayloadV1);
        DemoAppModule.onQRScanResult("OnQRScanResult", json);
        finish();
    }
}
