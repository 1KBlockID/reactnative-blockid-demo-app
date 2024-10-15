import {
  setLicenseKey,
  isReady,
  initiateTempWallet,
  registerTenantWith,
  enrollDeviceAuth,
  isDeviceAuthRegisterd,
  verifyDeviceAuth,
  totp,
  enrollLiveIDScanning,
  isLiveIDRegisterd,
  stopLiveIDScanning,
  verifyLiveIDScanning,
  resetSDK,
  getUserDocument,
  scanDocument,
  registerNationalIDWithLiveID,
  startQRScanning,
  isUrlTrustedSessionSources,
  getScopesAttributesDic,
  authenticateUserWithScopes,
  registerDrivingLicenceWithLiveID,
  registerPassportWithLiveID,
  stopQRScanning,
  lockSDK,
  unLockSDK,
} from 'react-native-blockidplugin';

import * as AppConstants from './AppConstants';
import { DocType, type TotpResponse } from '../../src/WrapperModel';
import { Alert } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

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

  async lockSDK(): Promise<void> {
    try {
      let result = await lockSDK();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
    }
  }

  async unLockSDK(): Promise<void> {
    try {
      let result = await unLockSDK();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
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

  async enrollLiveIDScanning(): Promise<void> {
    try {
      if (!(await this.checkCamera())) {
        return;
      }
      await enrollLiveIDScanning(AppConstants.dvcID);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
    }
  }

  async verifyLiveIDScanning(): Promise<void> {
    try {
      if (!(await this.checkCamera())) {
        return;
      }
      await verifyLiveIDScanning(AppConstants.dvcID);
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

  async scanDocument(type: DocType): Promise<string | null> {
    let response = await getUserDocument(type);

    if (response == null || response === undefined) {
      let documentStr = await scanDocument(type);
      if (documentStr != null && documentStr.length > 0) {
        return documentStr;
      } else {
        console.warn('Scan document failed');
      }
    } else {
      var message = '';
      switch (type) {
        case DocType.none:
          message = 'No document type selected';
          break;
        case DocType.nationalId:
          message = 'National ID is already registered';
          break;
        case DocType.drivingLicence:
          message = 'Driving Licence is already registered';
          break;
        case DocType.passport:
          message = 'Passport is already registered';
          break;
        default:
          message = 'Unknown document type';
          break;
      }
      Alert.alert('Success', message);
    }
    return null;
  }

  isString(value: any): value is string {
    return typeof value === 'string';
  }

  async checkCamera() {
    if (Platform.OS === 'android') {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      if (result !== RESULTS.GRANTED) {
        Alert.alert('Error', 'Camera permission is restricted');
        return false;
      }
    }
    return true;
  }

  async startQRScan() {
    try {
      if (!(await this.checkCamera())) {
        return;
      }
      let qrData = await startQRScanning();
      const qrDataString = qrData?.toString() || '';
      await stopQRScanning();
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

  async registerNationalIDWithLiveID(strJson: string) {
    try {
      const obj = JSON.parse(strJson);
      if (obj) {
        let idCardObj = obj.idcard_object;
        if (idCardObj) {
          idCardObj.proof = idCardObj.proof_jwt;
          idCardObj.certificate_token = obj.token;
          const liveidObj = obj.liveid_object;
          if (liveidObj) {
            const face = liveidObj.face;
            const proofedBy = liveidObj.proofedBy;
            if (this.isString(face) && this.isString(proofedBy)) {
              const idCardEntries = Object.entries(idCardObj);
              let response = await registerNationalIDWithLiveID(
                Object.fromEntries(idCardEntries),
                face,
                proofedBy
              );
              return response;
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
      return false;
    }
    return false;
  }

  async registerDrivingLicenceWithLiveID(strJson: string): Promise<boolean> {
    try {
      const obj = JSON.parse(strJson);
      if (obj) {
        let dlObj = obj.dl_object;
        if (dlObj) {
          dlObj.proof = dlObj.proof_jwt;
          dlObj.certificate_token = obj.token;
          const liveidObj = obj.liveid_object;
          if (liveidObj) {
            const face = liveidObj.face;
            const proofedBy = liveidObj.proofedBy;
            if (this.isString(face) && this.isString(proofedBy)) {
              const idCardEntries = Object.entries(dlObj);
              let response = await registerDrivingLicenceWithLiveID(
                Object.fromEntries(idCardEntries),
                face,
                proofedBy
              );
              return response;
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
      return false;
    }
    return false;
  }

  async registerPassportWithLiveID(strJson: string): Promise<boolean> {
    try {
      const obj = JSON.parse(strJson);
      if (obj) {
        let pptObj = obj.ppt_object;
        if (pptObj) {
          pptObj.proof = pptObj.proof_jwt;
          pptObj.certificate_token = obj.token;
          const liveidObj = obj.liveid_object;
          if (liveidObj) {
            const face = liveidObj.face;
            const proofedBy = liveidObj.proofedBy;
            if (this.isString(face) && this.isString(proofedBy)) {
              const idCardEntries = Object.entries(pptObj);
              let response = await registerPassportWithLiveID(
                Object.fromEntries(idCardEntries),
                face,
                proofedBy
              );
              return response;
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Accessing the error message
      } else {
        console.error(error); // Log the error if its type is unknown
      }
      return false;
    }
    return false;
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
