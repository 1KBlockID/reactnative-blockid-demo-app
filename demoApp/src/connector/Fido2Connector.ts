import {Alert, NativeModules} from 'react-native';
import {Fido2Error, Fido2PayloadModel} from '../constants/Fido2PayloadModel';

const {DemoAppModule} = NativeModules;

//BlockId set pin functionality
export const setFidoPin = async (
  payload: Fido2PayloadModel,
): Promise<string | null> => {
  const {errorHandler, pin} = payload;
  try {
    const setPinResponse = await DemoAppModule.setFidoPin(pin);
    return setPinResponse;
  } catch (error) {
    __DEV__ && console.log('SetFido2Pin action failed:', error);
    errorHandler?.(error);
    return null;
  }
};

//BlockId reset pin functionality
export const resetPin = async (
  payload: Fido2PayloadModel,
): Promise<string | null> => {
  const {errorHandler} = payload;
  try {
    const resetPinResponse = await DemoAppModule.resetPin();
    return resetPinResponse;
  } catch (error) {
    __DEV__ && console.log('ResetPin action failed:', error);
    errorHandler?.(error);
    return null;
  }
};

//BlockId change pin functionality
export const ChangePin = async (
  payload: Fido2PayloadModel,
): Promise<string | null> => {
  const {errorHandler, pin, currentPin} = payload;
  try {
    const changePinResponse = await DemoAppModule.changePin(currentPin, pin);
    return changePinResponse;
  } catch (error) {
    // eslint-disable-next-line no-console
    __DEV__ && console.log('change Pin action failed:', error);
    errorHandler?.(error);
    return null;
  }
};

export const setLicenseKey = async () => {
  try {
    await DemoAppModule.initRegistrations();
    // eslint-disable-next-line no-console
    __DEV__ && console.log('initRegistrations Success');
  } catch (e) {
    // eslint-disable-next-line no-console
    __DEV__ && console.log('ERROR IN initRegistrations', e);
  }
};
