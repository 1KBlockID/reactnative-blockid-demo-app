import {NativeModules} from 'react-native';
import { Fido2PayloadModel} from '../constants/Fido2PayloadModel';

const {DemoAppModule} = NativeModules;

//BlockId set pin functionality
export const setFIDO2PIN = async (
  payload: Fido2PayloadModel,
): Promise<string | null> => {
  const {errorHandler, pin} = payload;
  try {
    const setPinResponse = await DemoAppModule.setFIDO2PIN(pin);
    return setPinResponse;
  } catch (error) {
    errorHandler?.(error);
    return null;
  }
};

//BlockId reset pin functionality
export const resetFIDO2 = async (
  payload: Fido2PayloadModel,
): Promise<string | null> => {
  const {errorHandler} = payload;
  try {
    const resetFIDO2Response = await DemoAppModule.resetFIDO2();
    return resetFIDO2Response;
  } catch (error) {
    errorHandler?.(error);
    return null;
  }
};

//BlockId change pin functionality
export const changeFIDO2PIN = async (
  payload: Fido2PayloadModel,
): Promise<string | null> => {
  const {errorHandler, pin, currentPin} = payload;
  try {
    const changeFIDO2PINResponse = await DemoAppModule.changeFIDO2PIN(
      currentPin,
      pin,
    );
    return changeFIDO2PINResponse;
  } catch (error) {
    errorHandler?.(error);
    return null;
  }
};
