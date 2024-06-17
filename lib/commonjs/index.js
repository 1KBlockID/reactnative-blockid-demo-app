"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticateUserWithScopes = authenticateUserWithScopes;
exports.enrollDeviceAuth = enrollDeviceAuth;
exports.getScopesAttributesDic = getScopesAttributesDic;
exports.getUserDocument = getUserDocument;
exports.initiateTempWallet = initiateTempWallet;
exports.isDeviceAuthRegisterd = isDeviceAuthRegisterd;
exports.isLiveIDRegisterd = isLiveIDRegisterd;
exports.isReady = isReady;
exports.isUrlTrustedSessionSources = isUrlTrustedSessionSources;
exports.registerDrivingLicenceWithLiveID = registerDrivingLicenceWithLiveID;
exports.registerNationalIDWithLiveID = registerNationalIDWithLiveID;
exports.registerPassportWithLiveID = registerPassportWithLiveID;
exports.registerTenantWith = registerTenantWith;
exports.resetSDK = resetSDK;
exports.scanDocument = scanDocument;
exports.setLicenseKey = setLicenseKey;
exports.startLiveIDScanning = startLiveIDScanning;
exports.startQRScanning = startQRScanning;
exports.stopLiveIDScanning = stopLiveIDScanning;
exports.stopQRScanning = stopQRScanning;
exports.totp = totp;
exports.verifyDeviceAuth = verifyDeviceAuth;
var _reactNative = require("react-native");
const LINKING_ERROR = `The package 'react-native-blockidplugin' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;
const BlockidpluginModule = isTurboModuleEnabled ? require('./NativeBlockidplugin').default : _reactNative.NativeModules.Blockidplugin;
const Blockidplugin = BlockidpluginModule ? BlockidpluginModule : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
function setLicenseKey(licenseKey) {
  return Blockidplugin.setLicenseKey(licenseKey);
}
function initiateTempWallet() {
  return Blockidplugin.initiateTempWallet();
}
function registerTenantWith(tag, community, dns) {
  return Blockidplugin.registerTenantWith(tag, community, dns);
}
function isReady() {
  return Blockidplugin.isReady();
}
function enrollDeviceAuth() {
  return Blockidplugin.enrollDeviceAuth();
}
function isDeviceAuthRegisterd() {
  return Blockidplugin.isDeviceAuthRegisterd();
}
function verifyDeviceAuth() {
  return Blockidplugin.verifyDeviceAuth();
}
async function totp() {
  return await Blockidplugin.totp();
}
function isLiveIDRegisterd() {
  return Blockidplugin.isLiveIDRegisterd();
}
async function startLiveIDScanning(dvcID) {
  return await Blockidplugin.startLiveIDScanning(dvcID);
}
function stopLiveIDScanning() {
  return Blockidplugin.stopLiveIDScanning();
}
function resetSDK(tag, community, dns, licenseKey, reason) {
  return Blockidplugin.resetSDK(tag, community, dns, licenseKey, reason);
}
function startQRScanning() {
  return Blockidplugin.startQRScanning();
}
function stopQRScanning() {
  return Blockidplugin.stopQRScanning();
}
function isUrlTrustedSessionSources(url) {
  return Blockidplugin.isUrlTrustedSessionSources(url);
}
function getScopesAttributesDic(data) {
  return Blockidplugin.getScopesAttributesDic(data);
}
function authenticateUserWithScopes(data) {
  return Blockidplugin.authenticateUserWithScopes(data);
}
function getUserDocument(type) {
  return Blockidplugin.getUserDocument(type);
}
function scanDocument(type) {
  return Blockidplugin.scanDocument(type);
}
function registerNationalIDWithLiveID(data, face, proofedBy) {
  return Blockidplugin.registerNationalIDWithLiveID(data, face, proofedBy);
}
function registerDrivingLicenceWithLiveID(data, face, proofedBy) {
  return Blockidplugin.registerDrivingLicenceWithLiveID(data, face, proofedBy);
}
function registerPassportWithLiveID(data, face, proofedBy) {
  return Blockidplugin.registerPassportWithLiveID(data, face, proofedBy);
}
//# sourceMappingURL=index.js.map