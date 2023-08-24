import { NativeModules, Platform } from 'react-native';
import { Fido2PayloadModel } from '../constants/Fido2PayloadModel';
import { sdkInformation } from '../constants/Types';

const { DemoAppModule } = NativeModules;

//set LicenseKey
export const setLicenseKey = async () => {
    try {
        await DemoAppModule.initRegistrations();
    } catch (e) {
        // eslint-disable-next-line no-console
        __DEV__ && console.log(e)
    }
};

//handle RegisterTenant
export const handleRegisterTenant = async (
    payload: Fido2PayloadModel,
): Promise<string | null> => {
    const { errorHandler } = payload;
    try {
        const registerTenantResponse = await DemoAppModule.beginRegistration();
        return registerTenantResponse;
    } catch (error) {
        errorHandler?.(error);
        return null;
    }
};

//getSDK information
export const getAboutScreenInformation = async (): Promise<sdkInformation> => {
    const response = await DemoAppModule.getSDKInfo();
    let sdkInfo = response;
    if (Platform.OS === 'android') {
        sdkInfo = JSON.parse(response);
        return sdkInfo
    }
    else {
        return response
    }
};

//reset SDK
export const resetSdk = () => {
    try {
        DemoAppModule.resetSDK();
    }
    catch (e) {
        __DEV__ && console.log('onResetSdk', e);
    }
}