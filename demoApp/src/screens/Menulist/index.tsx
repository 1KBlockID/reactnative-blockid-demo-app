import React, {useState} from 'react';
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
  Alert,
  Linking,
} from 'react-native';
import {styles} from './style';
import {Colors} from '../../constants/Colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../RootStackParams';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, StackActions} from '@react-navigation/native';
import {checkAndRequestPermissions} from '../../utils/Permissions';
import {DialogBox} from '../../components/DialogBox';
import {Strings} from '../../constants/Strings';
import {Images} from '../../constants/Images';
import {setLicenseKey} from '../../connector/Fido2Connector';

type Props = NativeStackScreenProps<RootParamList, 'MenuScreen'>;

function MenuScreen({navigation}: Props): JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);
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
      let isPermissionsGranted = await checkAndRequestPermissions();
      if (isPermissionsGranted) {
        DemoAppModule.StartLiveScan();
      } else {
        console.log('ON else part');
        Linking.openSettings();
      }
    }
    if (index === 4) {
      navigation.navigate('Fido2Screen');
    }
    if (index === 5) {
      navigation.navigate('PinScreen');
    }
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return index !== 5 || Platform.OS === 'ios' ? (
      <TouchableOpacity
        key={index}
        style={styles.buttonStyle}
        onPress={() => handleClick(index)}>
        <Text style={styles.buttonText}>{item.title}</Text>
        {index === 1 && (
          <Image source={Images.greenTick} style={styles.tickImageStyle} />
        )}
      </TouchableOpacity>
    ) : null;
  };
  const handleOkPress = async () => {
    if (Platform.OS === 'ios') {
      setLicenseKey();
    }
    AsyncStorage.clear()
      .then(res => {
        setModalVisible(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'HomeScreen'}],
          }),
        );
      })
      .catch(error => {
        console.log('Error', error);
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
