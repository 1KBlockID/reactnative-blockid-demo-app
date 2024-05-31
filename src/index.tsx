import { NativeModules, Platform } from 'react-native';

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
