import React from 'react';
import {
  Alert,
  Image,
  NativeModules,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './style';
import {Colors} from '../../constants/Colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../RootStackParams';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootParamList, 'LoginScreen'>;

function LoginScreen({navigation}: Props): JSX.Element {
  const {Fido2Module} = NativeModules;

  const handleClick = async () => {
    try {
      const response = await Fido2Module.enrollBiometricAssets();
      if (response === 'OK') {
        Toast.show({
          text2: 'login Successfully !',
          position: 'bottom',
          type: 'success',
        });
        setTimeout(() => {
          navigation.navigate('MenuScreen');
        }, 500);
      } else {
        Alert.alert('Please enroll biometric first ');
      }
    } catch (e) {
      console.log('enrollBiometric Assets', e);
    }
  };
  return (
    <>
      <View style={[styles.statusBar]}>
        <SafeAreaView style={styles.safeAreaContainer}>
          <StatusBar
            barStyle={'light-content'}
            backgroundColor={Colors.black}
          />
        </SafeAreaView>
      </View>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.loginText}>
          Please enable the following method for future login
        </Text>
        <TouchableOpacity style={styles.buttonStyle} onPress={handleClick}>
          <Text style={styles.buttonTextStyle}>TouchID /{'\n'} FaceID</Text>
        </TouchableOpacity>
        <Toast />
      </View>
    </>
  );
}

export default LoginScreen;
