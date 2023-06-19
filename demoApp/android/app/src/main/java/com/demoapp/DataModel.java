package com.demoapp;

import com.onekosmos.blockid.sdk.datamodel.BIDTenant;

public class DataModel {
    String licenseKey;
    BIDTenant tenant;
    BIDTenant clientTenant;
    String DID;
    String publicKey;
    String SdkVersion;

    public String getLicenseKey() {
        return licenseKey;
    }

    public void setLicenseKey(String licenseKey) {
        this.licenseKey = licenseKey;
    }

    public BIDTenant getTenant() {
        return tenant;
    }

    public void setTenant(BIDTenant tenant) {
        this.tenant = tenant;
    }

    public BIDTenant getClientTenant() {
        return clientTenant;
    }

    public void setClientTenant(BIDTenant clientTenant) {
        this.clientTenant = clientTenant;
    }

    public String getDID() {
        return DID;
    }

    public void setDID(String DID) {
        this.DID = DID;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public String getSdkVersion() {
        return SdkVersion;
    }

    public void setSdkVersion(String sdkVersion) {
        SdkVersion = sdkVersion;
    }
}