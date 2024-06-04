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
} from 'react-native-blockidplugin';

import * as AppConstants from './AppConstants';
import type { TotpResponse, DocType } from '../../src/WrapperModel';
import { Alert } from 'react-native';

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
    console.log('hell response', response);
    if (response == null || response === undefined) {
      console.log('Start can', response);
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
    let response = await registerNationalIDWithLiveID(obj);
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
