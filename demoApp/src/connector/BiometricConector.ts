import { NativeModules } from 'react-native';

const { DemoAppModule } = NativeModules;
export const handleEnrollBiometric = async (): Promise<boolean> => {
    try {
        const response = await DemoAppModule.enrollBiometricAssets();
        if (response === 'OK') {
            return true
        } else {
            return false
        }
    } catch (e) {
        __DEV__ && console.log('enrollBiometric Assets', e);
        return false
    }
}