import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (value: string | boolean, key: string) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    __DEV__ && console.log('storeData Error', e);
  }
};

export const getData = async (key: string): Promise<any> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return false;
  }
  return false;
};
