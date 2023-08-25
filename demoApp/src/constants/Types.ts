export type sdkInformation = {
    DID: string;
    clientTenant: {
        community: string;
        dns: string;
        tenantTag: string;
    }
    licenseKey: string
    publicKey: string
    sdkVersion: string
    tenant: {
        community: string
        communityId: string
        dns: string
        tenantId: string
        tenantTag: string
    }
}