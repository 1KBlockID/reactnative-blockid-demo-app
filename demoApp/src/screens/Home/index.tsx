import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  NativeModules,
  SafeAreaView,
  StatusBar,
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
        await DemoAppModule.register_Tenant();
        storeData(true, 'isRegister');
        setTimeout(() => {
          navigation.navigate('LoginScreen');
        }, 1000);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
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
    </SafeAreaView>
  );
}

export default HomeScreen;
