import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { DocType, TotpResponse } from './WrapperModel';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): Promise<number>;
  add(a: number, b: number): Promise<number>;
  setLicenseKey(licenseKey: string): Promise<boolean>;
  isReady(): Promise<boolean>;
  initiateTempWallet(): Promise<boolean>;
  registerTenantWith(
    tag: string,
    community: string,
    dns: string
  ): Promise<boolean>;
  enrollDeviceAuth(): Promise<boolean>;
  isDeviceAuthRegisterd(): Promise<boolean>;
  verifyDeviceAuth(): Promise<boolean>;
  totp(): Promise<TotpResponse | null>;
  isLiveIDRegisterd(): Promise<boolean>;
  startLiveIDScanning(dvcID: string): Promise<void>;
  stopLiveIDScanning(): Promise<void>;
  resetSDK(
    tag: string,
    community: string,
    dns: string,
    licenseKey: string,
    reason: string
  ): Promise<boolean>;
  getUserDocument(type: DocType): Promise<string | null>;
  scanDocument(type: DocType): Promise<string | null>;
  registerNationalIDWithLiveID(data: Map<string, any>): Promise<boolean>;
}
export default TurboModuleRegistry.getEnforcing<Spec>('Blockidplugin');
