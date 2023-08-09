import {NativeModules} from 'react-native';
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
    errorHandler?.(error);
    return null;
  }
};

//set LicenseKey
export const setLicenseKey = async () => {
  try {
    await DemoAppModule.initRegistrations();
  } catch (e) {
    // eslint-disable-next-line no-console
  }
};
