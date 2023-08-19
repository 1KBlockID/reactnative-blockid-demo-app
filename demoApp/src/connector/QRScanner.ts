import {NativeModules} from 'react-native';
import {sessionDataResponseType} from '../helper/ScopeData';
const {DemoAppModule} = NativeModules;

// user authenticate IOS
export const onUserAuthenticate = async (
  sessionData: sessionDataResponseType,
): Promise<string | boolean> => {
  return await DemoAppModule.authenticateUser(
    sessionData?.userId ?? '',
    sessionData?.session ?? '',
    sessionData?.creds ?? '',
    sessionData?.scopes ?? '',
    sessionData?.sessionUrl,
    sessionData?.tag ?? '',
    sessionData?.name ?? '',
    sessionData?.publicKey ?? '',
  )
    .then((response: any) => {
      if (response === true) {
        return true;
      } else {
        return response;
      }
    })
    .catch((error: any) => {
      __DEV__ && console.log('error IOS', error);
      return false;
    });
};

// user authenticate Android
export const authenticateUserAndroid = async (
  sessionData: sessionDataResponseType,
): Promise<string | boolean> => {
  return await DemoAppModule.authenticateUser(
    sessionData?.session ?? '',
    sessionData?.sessionURL,
    sessionData?.scopes ?? '',
    sessionData?.creds ?? '',
    sessionData?.tag ?? '',
    sessionData?.community ?? '',
    sessionData?.publicKey ?? '',
    sessionData?.api ?? '',
    sessionData?.authPage ?? '',
  )
    .then((response: any) => {
      if (response === true) {
        return true;
      } else {
        return response;
      }
    })
    .catch((error: any) => {
      __DEV__ && console.log('error', error);
      return false;
    });
};
