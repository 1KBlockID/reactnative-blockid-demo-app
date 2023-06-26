import {Platform} from 'react-native';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';

const REQUIRED_PERMISSIONS =
  Platform.OS === 'ios'
    ? [PERMISSIONS.IOS.CAMERA]
    : [PERMISSIONS.ANDROID.CAMERA];

function isPermissionsGranted(statuses) {
  return REQUIRED_PERMISSIONS.every(
    permission =>
      statuses[permission] === RESULTS.UNAVAILABLE ||
      statuses[permission] === RESULTS.GRANTED,
  );
}

export const checkAndRequestPermissions = async () => {
  const statuses = await checkMultiple(REQUIRED_PERMISSIONS);
  console.log('REQUIRED_PERMISSIONS', statuses);
  if (isPermissionsGranted(statuses)) {
    return true;
  } else {
    const askPermissions = REQUIRED_PERMISSIONS.filter(
      permission => statuses[permission] === RESULTS.DENIED);
    if (askPermissions.length) {
      requestMultiple(REQUIRED_PERMISSIONS).then(results => {
        if (isPermissionsGranted(results)) {
          return true;
        } else {
          return checkAndRequestPermissions();
        }
      });
    } else {
      return true;
    }
  }
};
