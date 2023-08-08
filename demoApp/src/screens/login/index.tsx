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
import {Strings} from '../../constants/Strings';
import {Images} from '../../constants/Images';
import {CommonActions} from '@react-navigation/native';

type Props = NativeStackScreenProps<RootParamList, 'LoginScreen'>;

function LoginScreen({navigation}: Props): JSX.Element {
  const {DemoAppModule} = NativeModules;

  const handleClick = async () => {
    try {
      const response = await DemoAppModule.enrollBiometricAssets();
      if (response === 'OK') {
        Toast.show({
          text2: 'login Successfully !',
          position: 'bottom',
          type: 'success',
        });
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'MenuScreen'}],
          }),
        );
      } else {
        Alert.alert('Please enroll biometric first ');
      }
    } catch (e) {
      __DEV__ && console.log('enrollBiometric Assets', e);
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
          <Image source={Images.logo} style={styles.logo} />
        </View>
        <Text style={styles.loginText}>{Strings.EnableFutureLogin}</Text>
        <TouchableOpacity style={styles.buttonStyle} onPress={handleClick}>
          <Text style={styles.buttonTextStyle}>{Strings.TouchAndFaceId}</Text>
        </TouchableOpacity>
        <Toast />
      </View>
    </>
  );
}

export default LoginScreen;
