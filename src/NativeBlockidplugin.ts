import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

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
}

export default TurboModuleRegistry.getEnforcing<Spec>('Blockidplugin');
