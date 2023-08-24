import { NativeModules } from 'react-native';

const { DemoAppModule } = NativeModules;

//handle Live Scanning
export const startLiveIDScanner = () => {
    DemoAppModule.startLiveScan();
}

export const isLiveIdRegistered = async (): Promise<boolean> => {
    return DemoAppModule.isLiveIdRegistered()
        .then((res: any) => {
            if (res === 'Yes') {
                return true
            }
            else {
                return false
            }
        })
        .catch((error: any) => {
            __DEV__ && console.log('error', error);
            return false
        });
}