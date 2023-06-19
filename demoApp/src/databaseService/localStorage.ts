import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (value: any, key: string) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log('storeData Error', e);
  }
};

export const getData = async (key: string): Promise<any> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log(key, value);
      return value;
    }
  } catch (e) {
    console.log('getData Error', e);
    return false;
  }
  return false;
};
