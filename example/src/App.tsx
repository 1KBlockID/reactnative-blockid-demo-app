import 'react-native-gesture-handler';
import 'react-native-screens';
import { enableScreens } from 'react-native-screens';
enableScreens(false);
import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from './RootStackParam';
import HomeScreen from './screens/HomeScreen';
import FeatureEnrollmentScreen from './screens/FeatureEnrollmentScreen';
import TOTPScreen from './screens/TOTPScreen';
import LiveIDScreen from './screens/LiveIDScreen';
import QRAuthScreen from './screens/QRAuthScreen';
import QRScreen from './screens/QRScreen';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import customBackIcon from '../assets/Vector.png';
import type { FeatureEnrollmentScreenNavigationProp } from './Navprops';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'column',
    padding: 10,
    backgroundColor: 'white',
  },
  customIcon: {
    width: 18,
    height: 18,
    top: 6,
    left: 9,
    marginBottom: 12,
    objectFit: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    right: 20,
    bottom: 12,
    left: 10,
    top: 12,
  },
});

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
    card: 'white',
    text: 'black',
    primary: 'black',
  },
};

const Stack = createStackNavigator<RootStackParamList>();

type CustomHeaderProps = {
  navigation: FeatureEnrollmentScreenNavigationProp;
};

// Custom Header Component
const CustomHeader: React.FC<CustomHeaderProps> = ({ navigation }) => {
  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={customBackIcon} style={styles.customIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Features</Text>
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <NavigationContainer theme={Theme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          cardStyle: { backgroundColor: 'white' },
          headerTintColor: 'black',
          detachInactiveScreens: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Tenant' }}
        />
        <Stack.Screen
          name="Featurelist"
          component={FeatureEnrollmentScreen}
          options={{
            header: ({ navigation }) => (
              <CustomHeader navigation={navigation as FeatureEnrollmentScreenNavigationProp} />
            ),
          }}
        />
        <Stack.Screen name="TOTP" component={TOTPScreen} />
        <Stack.Screen name="LiveID" component={LiveIDScreen} options={{ title: 'LiveID' }} />
        <Stack.Screen name="QRScan" component={QRScreen} />
        <Stack.Screen name="QRAuth" component={QRAuthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
