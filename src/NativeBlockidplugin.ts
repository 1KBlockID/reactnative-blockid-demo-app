import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { TotpResponse } from './WrapperModel';

export interface Spec extends TurboModule {
  setLicenseKey(licenseKey: string): Promise<boolean>;
  initiateTempWallet(): Promise<boolean>;
  registerTenantWith(
    tag: string,
    community: string,
    dns: string
  ): Promise<boolean>;
  isReady(): Promise<boolean>;
  enrollDeviceAuth(): Promise<boolean>;
  isDeviceAuthRegistered(): Promise<boolean>;
  verifyDeviceAuth(): Promise<boolean>;
  totp(): Promise<TotpResponse | null>;
  isLiveIDRegisterd(): Promise<boolean>;
  enrollLiveIDScanning(
    dvcID: string,
    mobileSessionID: string | null,
    mobileDocumentID: string | null
  ): Promise<void>;
  verifyLiveIDScanning(
    dvcID: string,
    mobileSessionID: string | null,
    mobileDocumentID: string | null
  ): Promise<void>;
  verifyFaceWithLiveness(
    dvcID: string,
    mobileSessionID: string | null,
    mobileDocumentID: string | null
  ): Promise<void>;

  stopLiveIDScanning(): Promise<void>;
  resetSDK(
    tag: string,
    community: string,
    dns: string,
    licenseKey: string,
    reason: string
  ): Promise<boolean>;
  startQRScanning(): Promise<string | null>;
  stopQRScanning(): Promise<boolean>;
  isUrlTrustedSessionSources(url: string): Promise<boolean>;
  getScopesAttributesDic(data: Object): Promise<Map<string, any> | null>;
  authenticateUserWithScopes(data: Object): Promise<boolean>;
  getUserDocument(type: number): Promise<string | null>;
  scanDocument(type: number): Promise<string | null>;
  registerNationalIDWithLiveID(
    data: Object,
    face: string,
    proofedBy: string,
    mobileSessionID: string | null,
    mobileDocumentID: string | null
  ): Promise<boolean>;
  registerDrivingLicenceWithLiveID(
    data: Object,
    face: string,
    proofedBy: string,
    mobileSessionID: string | null,
    mobileDocumentID: string | null
  ): Promise<boolean>;
  registerPassportWithLiveID(
    data: Object,
    face: string,
    proofedBy: string,
    mobileSessionID: string | null,
    mobileDocumentID: string | null
  ): Promise<boolean>;
  blockIDSDKVerion(): Promise<string>;
  getDID(): Promise<string>;
  lockSDK(): Promise<void>;
  unLockSDK(): Promise<void>;
}
export default TurboModuleRegistry.getEnforcing<Spec>('Blockidplugin');
