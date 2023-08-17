package com.onekosmos.blockid.reactnative.poc;

import com.onekosmos.blockid.sdk.datamodel.BIDTenant;

/**
 * Created by 1Kosmos Engineering
 * Copyright © 2023 1Kosmos. All rights reserved.
 */

public class DataModel {
    String licenseKey;
    BIDTenant tenant;
    BIDTenant clientTenant;
    String DID;
    String publicKey;
    String sdkVersion;


    public void setTenant(BIDTenant tenant) {
        this.tenant = tenant;
    }

    public void setLicenseKey(String licenseKey) {
        this.licenseKey = licenseKey;
    }

    public BIDTenant getClientTenant() {
        return clientTenant;
    }

    public void setClientTenant(BIDTenant clientTenant) {
        this.clientTenant = clientTenant;
    }

    public void setDID(String DID) {
        this.DID = DID;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public void setSdkVersion(String sdkVersion) {
        this.sdkVersion = sdkVersion;
    }
}