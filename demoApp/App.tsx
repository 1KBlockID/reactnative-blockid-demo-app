import * as React from 'react';
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
import {useEffect} from 'react';
import QRSessionScreen from './src/screens/QRSession';
import SplashScreen from 'react-native-splash-screen';
LogBox.ignoreLogs(['Warning: ...']);
const Stack = createNativeStackNavigator<RootParamList>();
export const RootNavigation = createNavigationContainerRef<RootParamList>();

export default function App() {
  const {Fido2Module} = NativeModules;
  async function prepare() {
    try {
      await Fido2Module.initRegistrations();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('ERROR IN initRegistrations', e);
    }
  }
  useEffect(() => {
    prepare();
  }, []);

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
