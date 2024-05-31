import {
  setLicenseKey,
  isReady,
  initiateTempWallet,
  registerTenantWith,
} from 'react-native-blockidplugin';
import * as AppConstants from './AppConstants';

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

  // Public method to get the instance of the class
  public static getInstance(): HomeViewModel {
    if (!HomeViewModel.instance) {
      HomeViewModel.instance = new HomeViewModel();
    }
    return HomeViewModel.instance;
  }
}

export default HomeViewModel;
