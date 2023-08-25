import { Alert, NativeModules } from 'react-native';
import { storeData } from '../databaseService/localStorage';

const { DemoAppModule } = NativeModules;
export const handleRegisterFIDO2KeyUsingWeb = async (userName: string): Promise<boolean> => {
    return await DemoAppModule.registerFIDO2KeyUsingWeb(userName)
        .then((response: String) => {
            if (response === 'OK') {
                storeData(userName, 'userName');
                return true;
            }
        })
        .catch((error: Error) => {
            Alert.alert(JSON.stringify(error?.message ?? error));
            return false;
        });
}


export const handleAuthenticationFIDO2KeyUsingWeb = async (userName: string): Promise<boolean> => {
    return await DemoAppModule.authenticateFIDO2KeyUsingWeb(userName)
        .then((response: String) => {
            if (response === 'OK') {
                storeData(userName, 'userName');
                return true
            }
        })
        .catch((error: Error) => {
            Alert.alert(JSON.stringify(error?.message ?? error));
            return false
        });
}

export const registerFIDO2Key = (userName: string, pin: string, keyType?: string) => {
    return DemoAppModule.registerFIDO2(userName, keyType, pin ? pin : '')
        .then((res: string) => {
            if (res === 'OK') {
                storeData(userName, 'userName');
                return true
            }
        })
        .catch((error: Error) => {
            Alert.alert(JSON.stringify(error?.message ?? error));
            return false
        });
}



export const authenticateFIDO2 = async (userName: string, pin: string, keyType?: string,): Promise<boolean> => {
    return await DemoAppModule.authenticateFIDO2(userName, keyType, pin ? pin : '')
        .then((res: string) => {
            if (res === 'OK') {
                storeData(userName, 'userName');
                return true
            }
        })
        .catch((error: Error) => {
            Alert.alert(JSON.stringify(error?.message ?? error));
            return false
        });
}