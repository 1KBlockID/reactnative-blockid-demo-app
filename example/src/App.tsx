import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from './RootStackParam';
import HomeScreen from './screens/HomeScreen';
import FeatureEnrollmentScreen from './screens/FeatureEnrollmentScreen';
import TOTPScreen from './screens/TOTPScreen';
import LiveIDScreen from './screens/LiveIDScreen';

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white', // Set background color
    card: 'white', // Set card background color
    text: 'black', // Set text color
  },
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer theme={Theme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Tenant' }}
        />
        <Stack.Screen name="Featurelist" component={FeatureEnrollmentScreen} />
        <Stack.Screen name="TOTP" component={TOTPScreen} />
        <Stack.Screen name="LiveID" component={LiveIDScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
