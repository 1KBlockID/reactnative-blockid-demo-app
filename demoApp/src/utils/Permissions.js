import {Alert, Platform} from 'react-native';
import {PERMISSIONS, request, RESULTS, check} from 'react-native-permissions';

/**
 * check and ask for Camera Permission
 */

export const checkAndRequestPermissions = () => {
  return check(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
  )
    .then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert('This feature is not available on this device');
          return false;
          break;
        case RESULTS.DENIED:
          request(
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.CAMERA
              : PERMISSIONS.ANDROID.CAMERA,
          ).then(result => {
            switch (result) {
              case RESULTS.GRANTED:
                return true;
                break;
            }
          });
          break;
        case RESULTS.GRANTED:
          return true;
          break;
      }
    })
    .catch(error => {
      console.log(error);
      return false;
    });
  return false;
};
