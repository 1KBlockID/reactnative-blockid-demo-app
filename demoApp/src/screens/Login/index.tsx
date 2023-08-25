import React from 'react';
import {
  Alert,
  Image,
  NativeModules,
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
import { CustomStatusBar } from '../../components/StatusBar/CustomStatusBar';
import { handleEnrollBiometric } from '../../connector/BiometricConector';

type Props = NativeStackScreenProps<RootParamList, 'LoginScreen'>;

function LoginScreen({navigation}: Props): JSX.Element {
  const {DemoAppModule} = NativeModules;

  const handleClick = async () => {
    const response = await handleEnrollBiometric();
    if(response){
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
    }
    else{
      Alert.alert('Please enroll biometric first ');
    }
  };

  return (
    <View style={styles.container}>
      <CustomStatusBar
        backgroundColor={Colors.black}
        barTextColor="light-content"
      />
      <View style={styles.logoContainer}>
        <Image source={Images.logo} style={styles.logo} />
      </View>
      <Text style={styles.loginText}>{Strings.EnableFutureLogin}</Text>
      <TouchableOpacity style={styles.buttonStyle} onPress={handleClick}>
        <Text style={styles.buttonTextStyle}>{Strings.TouchAndFaceId}</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
}

export default LoginScreen;
