import {Platform} from 'react-native';
import {PERMISSIONS, request, RESULTS, check} from 'react-native-permissions';

const REQUIRED_PERMISSIONS =
  Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

export const checkAndRequestPermissions = async () => {
  const statuses = await check(REQUIRED_PERMISSIONS);
  if (statuses === RESULTS.GRANTED) {
    return true;
  } else {
    request(REQUIRED_PERMISSIONS).then(results => {
      __DEV__ && console.log('results', results);
      if (results === RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    });
  }
};
