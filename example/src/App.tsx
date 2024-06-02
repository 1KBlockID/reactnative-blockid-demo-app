import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from './RootStackParam';
import HomeScreen from './screens/HomeScreen';
import FeatureEnrollmentScreen from './screens/FeatureEnrollmentScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Tenant' }}
        />
        <Stack.Screen name="Featurelist" component={FeatureEnrollmentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
