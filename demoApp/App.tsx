import React from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/Home';
import {RootParamList} from './src/RootStackParams';
import AboutScreen from './src/screens/About';
import MenuScreen from './src/screens/Menulist';
import {LogBox, NativeModules, Platform} from 'react-native';
import LoginScreen from './src/screens/login';
import QRSessionScreen from './src/screens/QRSession';
import {getData} from './src/databaseService/localStorage';
import Fido2Screen from './src/screens/FIDO2';

LogBox.ignoreLogs(['Warning: ...']);
const Stack = createNativeStackNavigator<RootParamList>();
export const RootNavigation = createNavigationContainerRef<RootParamList>();

export default function App() {
  const {DemoAppModule} = NativeModules;

  const setLicenseKey = async () => {
    try {
      await DemoAppModule.initRegistrations();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('ERROR IN initRegistrations', e);
    }
  };

  async function prepare() {
    getData('isRegister').then(async res => {
      if (!res && Platform.OS === 'ios') {
        DemoAppModule.resetSDK();
      } else {
        setLicenseKey();
      }
    });
  }
  React.useEffect(() => {
    prepare();
  },[]);

  return (
    <NavigationContainer ref={RootNavigation}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} />
        <Stack.Screen name="MenuScreen" component={MenuScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="QRSessionScreen" component={QRSessionScreen} />
        <Stack.Screen name="Fido2Screen" component={Fido2Screen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
