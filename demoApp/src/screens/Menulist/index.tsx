import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  Platform,
  NativeEventEmitter,
} from 'react-native';
import {styles} from './style';
import {Colors} from '../../constants/Colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../RootStackParams';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import {checkAndRequestPermissions} from '../../utils/Permissions';
import {DialogBox} from '../../components/DialogBox';
import {Strings} from '../../constants/Strings';
import {Images} from '../../constants/Images';

type Props = NativeStackScreenProps<RootParamList, 'MenuScreen'>;

function MenuScreen({navigation}: Props): JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLiveIdRegistered, setIsLiveIdRegistered] = useState(false);
  const {DemoAppModule} = NativeModules;
  const DATA = [
    {
      id: 1,
      title: Strings.About,
    },
    {
      id: 2,
      title: Strings.DeviceAuth,
    },
    {
      id: 3,
      title: Strings.LoginWithQR,
    },
    {
      id: 4,
      title: Strings.LiveID,
    },
    {
      id: 5,
      title: Strings.FIDO2,
    },
    {
      id: 6,
      title: Strings.PinManagement,
    },
    {
      id: 7,
      title: Strings.ResetApp,
    },
  ];

  const handleClick = async (index: number) => {
    if (index === 0) {
      navigation.navigate('AboutScreen');
    }
    if (index === 2) {
      navigation.navigate('QRSessionScreen');
    }
    if (index === 6) {
      setModalVisible(!modalVisible);
    }
    if (index === 3) {
      if (checkAndRequestPermissions()) {
        DemoAppModule.StartLiveScan();
      }
    }
    if (index === 4) {
      navigation.navigate('Fido2Screen');
    }
    if (index === 5) {
      navigation.navigate('PinScreen');
    }
  };
  useEffect(() => {
    /**
     * call SDK method to check is liveID is enrolled or not
     */
    DemoAppModule.getIsLiveIdRegister()
      .then((res: any) => {
        if (res === 'Yes') {
          setIsLiveIdRegistered(true);
        }
      })
      .catch((error: any) => {
        __DEV__ && console.log('error', error);
      });
  }, []);

  useEffect(() => {
    /**
     * Call When liveId is enrolled successfully
     */
    if (Platform.OS === 'ios') {
      const eventEmitter = new NativeEventEmitter(NativeModules.RNEventEmitter);
      let eventListener = eventEmitter.addListener('OnQRScanResult', event => {
        console.log('OnLiveIdCapture', event);
        if (event === 'OK') {
          setIsLiveIdRegistered(true);
        }
      });
      return () => eventListener.remove();
    }
  }, []);

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return index !== 5 || Platform.OS === 'ios' ? (
      <TouchableOpacity
        key={index}
        style={styles.buttonStyle}
        onPress={() => handleClick(index)}>
        <Text style={styles.buttonText}>{item.title}</Text>
        {(index === 1 || (index === 3 && isLiveIdRegistered)) && (
          <Image source={Images.greenTick} style={styles.tickImageStyle} />
        )}
      </TouchableOpacity>
    ) : null;
  };

  /**
   * ResetApp functionality
   */
  const handleOkPress = async () => {
    AsyncStorage.clear()
      .then(res => {
        setModalVisible(false);
        if (Platform.OS === 'ios') {
          try {
            DemoAppModule.resetSDK();
          } catch (error) {
            __DEV__ && console.log('error ', error);
          }
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'HomeScreen'}],
          }),
        );
      })
      .catch(error => {
        __DEV__ && console.log('Error', error);
      });
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
        <FlatList data={DATA} renderItem={renderItem} />

        <DialogBox
          isModalVisible={modalVisible}
          handleOkClick={handleOkPress}
          handleCancelClick={() => setModalVisible(false)}
        />
      </View>
    </>
  );
}

export default MenuScreen;
