import { NativeModules, Platform } from 'react-native';
import type { TotpResponse } from './WrapperModel';

const LINKING_ERROR =
  `The package 'react-native-blockidplugin' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const BlockidpluginModule = isTurboModuleEnabled
  ? require('./NativeBlockidplugin').default
  : NativeModules.Blockidplugin;

const Blockidplugin = BlockidpluginModule
  ? BlockidpluginModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return Blockidplugin.multiply(a, b);
}

export function setLicenseKey(licenseKey: string): Promise<boolean> {
  return Blockidplugin.setLicenseKey(licenseKey);
}

export function initiateTempWallet(): Promise<boolean> {
  return Blockidplugin.initiateTempWallet();
}

export function registerTenantWith(
  tag: string,
  community: string,
  dns: string
): Promise<boolean> {
  return Blockidplugin.registerTenantWith(tag, community, dns);
}

export function isReady(): Promise<boolean> {
  return Blockidplugin.isReady();
}

export function enrollDeviceAuth(): Promise<boolean> {
  return Blockidplugin.enrollDeviceAuth();
}
export function isDeviceAuthRegisterd(): Promise<boolean> {
  return Blockidplugin.isDeviceAuthRegisterd();
}

export function verifyDeviceAuth(): Promise<boolean> {
  return Blockidplugin.verifyDeviceAuth();
}

export async function totp(): Promise<TotpResponse | null> {
  return await Blockidplugin.totp();
}

export async function startLiveIDScanning(dvcID: string): Promise<void> {
  return await Blockidplugin.startLiveIDScanning(dvcID);
}

export function isLiveIDRegisterd(): Promise<boolean> {
  return Blockidplugin.isLiveIDRegisterd();
}

export function stopLiveIDScanning(): Promise<void> {
  return Blockidplugin.stopLiveIDScanning();
}

export function resetSDK(
  tag: string,
  community: string,
  dns: string,
  licenseKey: string,
  reason: string
): Promise<boolean> {
  return Blockidplugin.resetSDK(tag, community, dns, licenseKey, reason);
}

export function getUserDocument(type: number): Promise<string | null> {
  return Blockidplugin.getUserDocument(type);
}

export function scanDocument(type: number): Promise<string | null> {
  return Blockidplugin.scanDocument(type);
}

export function registerNationalIDWithLiveID(data: Object): Promise<boolean> {
  return Blockidplugin.registerNationalIDWithLiveID(data);
}

export function startQRScanning(): Promise<string | null> {
  return Blockidplugin.startQRScanning();
}

export function stopQRScanning(): Promise<boolean> {
  return Blockidplugin.stopQRScanning();
}

export function isUrlTrustedSessionSources(url: string): Promise<boolean> {
  return Blockidplugin.isUrlTrustedSessionSources(url);
}

export function getScopesAttributesDic(
  data: Object
): Promise<Map<string, any> | null> {
  return Blockidplugin.getScopesAttributesDic(data);
}

export function authenticateUserWithScopes(data: Object): Promise<boolean> {
  return Blockidplugin.authenticateUserWithScopes(data);
}
