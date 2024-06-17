import { NativeModules, Platform } from 'react-native';
const LINKING_ERROR = `The package 'react-native-blockidplugin' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;
const BlockidpluginModule = isTurboModuleEnabled ? require('./NativeBlockidplugin').default : NativeModules.Blockidplugin;
const Blockidplugin = BlockidpluginModule ? BlockidpluginModule : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
export function setLicenseKey(licenseKey) {
  return Blockidplugin.setLicenseKey(licenseKey);
}
export function initiateTempWallet() {
  return Blockidplugin.initiateTempWallet();
}
export function registerTenantWith(tag, community, dns) {
  return Blockidplugin.registerTenantWith(tag, community, dns);
}
export function isReady() {
  return Blockidplugin.isReady();
}
export function enrollDeviceAuth() {
  return Blockidplugin.enrollDeviceAuth();
}
export function isDeviceAuthRegisterd() {
  return Blockidplugin.isDeviceAuthRegisterd();
}
export function verifyDeviceAuth() {
  return Blockidplugin.verifyDeviceAuth();
}
export async function totp() {
  return await Blockidplugin.totp();
}
export function isLiveIDRegisterd() {
  return Blockidplugin.isLiveIDRegisterd();
}
export async function startLiveIDScanning(dvcID) {
  return await Blockidplugin.startLiveIDScanning(dvcID);
}
export function stopLiveIDScanning() {
  return Blockidplugin.stopLiveIDScanning();
}
export function resetSDK(tag, community, dns, licenseKey, reason) {
  return Blockidplugin.resetSDK(tag, community, dns, licenseKey, reason);
}
export function startQRScanning() {
  return Blockidplugin.startQRScanning();
}
export function stopQRScanning() {
  return Blockidplugin.stopQRScanning();
}
export function isUrlTrustedSessionSources(url) {
  return Blockidplugin.isUrlTrustedSessionSources(url);
}
export function getScopesAttributesDic(data) {
  return Blockidplugin.getScopesAttributesDic(data);
}
export function authenticateUserWithScopes(data) {
  return Blockidplugin.authenticateUserWithScopes(data);
}
export function getUserDocument(type) {
  return Blockidplugin.getUserDocument(type);
}
export function scanDocument(type) {
  return Blockidplugin.scanDocument(type);
}
export function registerNationalIDWithLiveID(data, face, proofedBy) {
  return Blockidplugin.registerNationalIDWithLiveID(data, face, proofedBy);
}
export function registerDrivingLicenceWithLiveID(data, face, proofedBy) {
  return Blockidplugin.registerDrivingLicenceWithLiveID(data, face, proofedBy);
}
export function registerPassportWithLiveID(data, face, proofedBy) {
  return Blockidplugin.registerPassportWithLiveID(data, face, proofedBy);
}
//# sourceMappingURL=index.js.map