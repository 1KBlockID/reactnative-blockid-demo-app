package com.onekosmos.blockid.reactnative.poc;

import com.onekosmos.blockid.sdk.datamodel.BIDTenant;

/**
 * Created by 1Kosmos Engineering
 * Copyright © 2023 1Kosmos. All rights reserved.
 */

public final class AppConstants {
    public static final String licenseKey = "5809b7b7-886f-4c88-9061-59a2baf485be";
    public static final String dvcId = "default_config";
    public static final BIDTenant defaultTenant = new BIDTenant("1kosmos",
            "default",
            "https://1k-dev.1kosmos.net");
    public static final BIDTenant clientTenant = new BIDTenant("blockiddev-1kosmos",
            "default",
            "https://blockid-dev.1kosmos.net");
}