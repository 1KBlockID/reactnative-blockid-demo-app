import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  NativeModules,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {styles} from './style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../RootStackParams';
import {Colors} from '../../constants/Colors';
import {getData, storeData} from '../../databaseService/localStorage';
import {CommonActions} from '@react-navigation/native';
import {Images} from '../../constants/Images';
import {Strings} from '../../constants/Strings';
import { CustomStatusBar } from '../../components/StatusBar/CustomStatusBar';
type Props = NativeStackScreenProps<RootParamList, 'HomeScreen'>;

function HomeScreen({navigation}: Props): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const {DemoAppModule} = NativeModules;

  const setInitialScreen = () => {
    getData('isRegister').then(res => {
      if (res) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'LoginScreen'}],
          }),
        );
      }
      setTimeout(() => {
        SplashScreen.hide();
      }, 500);
    });
  };

  useEffect(() => {
    setInitialScreen();
  }, []);

  const buttonText = [
    {
      id: 1,
      buttonName: Strings.RegisterDefaultTenant,
    },
    {
      id: 2,
      buttonName: Strings.RestoreAccount,
    },
  ];

  const handleDefaultActions = async (index: number) => {
    if (index == 0) {
      try {
        setIsLoading(true);
        await DemoAppModule.beginRegistration();
        storeData(true, 'isRegister');
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'LoginScreen'}],
            }),
          );
        }, 1000);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.safeAreaContainer}>
      <CustomStatusBar
        backgroundColor={Colors.black}
        barTextColor="light-content"
      />
      {isLoading && (
        <View style={styles.indicatorOuterContainer}>
          <View style={[styles.indicatorContainer]}>
            <ActivityIndicator
              color={Colors.red}
              size={'small'}
              style={styles.indicatorStyle}
            />
            <Text style={styles.loaderText}>{Strings.PleaseWait}</Text>
          </View>
        </View>
      )}
      <View style={styles.logoContainer}>
        <Image source={Images.logo} style={styles.logo} />
      </View>
      <View style={styles.bottomContainer}>
        {buttonText.map((item: any, index: number) => {
          return (
            <TouchableOpacity
              style={styles.buttonContainerStyle}
              key={index}
              onPress={() => handleDefaultActions(index)}>
              <Text style={styles.buttonStyle}>{item.buttonName}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default HomeScreen;
