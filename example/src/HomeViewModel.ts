import {
  setLicenseKey,
  isReady,
  initiateTempWallet,
  registerTenantWith,
  enrollDeviceAuth,
  isDeviceAuthRegisterd,
  verifyDeviceAuth,
  totp,
  startLiveIDScanning,
  isLiveIDRegisterd,
  stopLiveIDScanning,
  resetSDK,
  getUserDocument,
  scanDocument,
  registerNationalIDWithLiveID,
  startQRScanning,
  stopQRScanning,
  isUrlTrustedSessionSources,
  getScopesAttributesDic,
  authenticateUserWithScopes,
  registerDrivingLicenceWithLiveID,
  registerPassportWithLiveID,
} from 'react-native-blockidplugin';

import * as AppConstants from './AppConstants';
import type { TotpResponse, DocType } from '../../src/WrapperModel';
import { Alert } from 'react-native';

import { AuthenticationPayloadV1 } from './AppModel';
import { ApiManager } from './ApiManager';

// Define the interface for TotpRes module
class HomeViewModel {
  private static instance: HomeViewModel;

  // Private constructor to prevent direct instantiation
  private constructor() {}

  async setLicenseKey(): Promise<boolean> {
    try {
      let result = await setLicenseKey(AppConstants.licenseKey);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
      return false;
    }
  }

  async isSDKReady(): Promise<boolean> {
    try {
      let result = await isReady();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
      return false;
    }
  }

  async initiateTempWallet(): Promise<boolean> {
    try {
      let result = await initiateTempWallet();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
      return false;
    }
  }

  async registerTenant(): Promise<boolean> {
    try {
      let result = await registerTenantWith(
        AppConstants.tag,
        AppConstants.community,
        AppConstants.dns
      );
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
      return false;
    }
  }

  async enrollDeviceAuth(): Promise<boolean> {
    try {
      let result = await enrollDeviceAuth();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
      return false;
    }
  }

  async isDeviceAuthRegisterd(): Promise<boolean> {
    try {
      let result = await isDeviceAuthRegisterd();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
      return false;
    }
  }

  async verifyDeviceAuth(): Promise<boolean> {
    try {
      let result = await verifyDeviceAuth();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
      return false;
    }
  }

  async totp(): Promise<TotpResponse | null> {
    try {
      let result = await totp();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
      return null;
    }
  }

  async isLiveIDRegisterd(): Promise<boolean> {
    try {
      let result = await isLiveIDRegisterd();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
      return false;
    }
  }

  async startLiveIDScanning(): Promise<void> {
    try {
      await startLiveIDScanning(AppConstants.dvcID);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
    }
  }

  async stopLiveIDScanning(): Promise<void> {
    await stopLiveIDScanning();
  }

  async resetSDK(): Promise<boolean> {
    let status = await resetSDK(
      AppConstants.tag,
      AppConstants.community,
      AppConstants.dns,
      AppConstants.licenseKey,
      'Reseting'
    );
    return status;
  }

  async scanDocument(type: DocType): Promise<Map<string, any> | null> {
    let response = await getUserDocument(type);
    if (response == null || response === undefined) {
      let documentStr = await scanDocument(type);
      if (documentStr != null && documentStr.length > 0) {
        let obj = this.jsonStringToDic(documentStr);
        return obj;
      } else {
        console.warn('Scan document failed');
      }
    } else {
      Alert.alert('Success', 'National ID is already registered');
    }
    return null;
  }

  jsonStringToDic(json: string): Map<string, any> | null {
    try {
      const data = JSON.parse(json) as Map<string, any>;
      return data;
    } catch (e) {
      console.error('jsonStringToDic', e);
      return null;
    }
  }

  async registerNationalIDWithLiveID(obj: Map<string, any>) {
    let response = await registerNationalIDWithLiveID(Object.fromEntries(obj));
    return response;
  }

  async startQRScan() {
    try {
      let qrData = await startQRScanning();
      await stopQRScanning();
      const qrDataString = qrData?.toString() || '';
      if (
        qrDataString !== '' &&
        qrDataString.startsWith('https://') &&
        qrDataString.includes('/sessions')
      ) {
        const arrSplitStrings = qrDataString.split('/session/');
        const url = arrSplitStrings?.[0] || '';
        const isTrustedUrl = await isUrlTrustedSessionSources(url);
        if (isTrustedUrl ?? false) {
          const apiManager = new ApiManager();
          const authenticationPayloadV2 =
            await apiManager.getSessionData(qrDataString);
          if (authenticationPayloadV2) {
            const authenticationPayloadV1 = AuthenticationPayloadV1.fromV2(
              authenticationPayloadV2,
              qrDataString
            );
            authenticationPayloadV1.scopes = authenticationPayloadV2.scopes
              ?.toLowerCase()
              ?.replace('windows', 'scep_creds');
            return authenticationPayloadV1;
          } else {
            console.error('BlockID ->>> getSessionData Api failure');
            return null;
          }
        } else {
          console.error('BlockID ->>> Not trusted url');
          return null;
        }
      } else {
        console.error('BlockID ->>> qrDataString validation error');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  async getScopesAttributesDic(data: Map<string, any>): Promise<string> {
    let response = await getScopesAttributesDic(Object.fromEntries(data));
    if (response != null && response !== undefined) {
      return JSON.stringify(response);
    }
    return 'Error Try again later';
  }

  async authenticateUserWithScopes(data: Map<string, any>) {
    let response = await authenticateUserWithScopes(Object.fromEntries(data));
    return response;
  }

  async registerDrivingLicenceWithLiveID(
    obj: Map<string, any>
  ): Promise<boolean> {
    let response = await registerDrivingLicenceWithLiveID(
      Object.fromEntries(obj)
    );
    return response;
  }

  async registerPassportWithLiveID(obj: Map<string, any>): Promise<boolean> {
    let response = await registerPassportWithLiveID(Object.fromEntries(obj));
    return response;
  }

  // Public method to get the instance of the class
  public static getInstance(): HomeViewModel {
    if (!HomeViewModel.instance) {
      HomeViewModel.instance = new HomeViewModel();
    }
    return HomeViewModel.instance;
  }
}

export default HomeViewModel;
