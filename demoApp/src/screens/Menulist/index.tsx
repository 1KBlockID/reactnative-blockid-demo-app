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
} from 'react-native';
import {styles} from './style';
import {Colors} from '../../constants/Colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../RootStackParams';
import {DialogBox} from '../../components/DialogBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, StackActions} from '@react-navigation/native';
import {checkAndRequestPermissions} from '../../utils/Permissions';

type Props = NativeStackScreenProps<RootParamList, 'MenuScreen'>;

function MenuScreen({navigation}: Props): JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);
  const {DemoAppModule} = NativeModules;
  const DATA = [
    {
      id: 1,
      title: 'About',
    },
    {
      id: 2,
      title: 'Device Auth',
    },
    {
      id: 3,
      title: 'Login with QR',
    },
    {
      id: 4,
      title: 'LiveID',
    },
    {
      id: 5,
      title: 'FIDO2',
    },
    {
      id: 6,
      title: 'Reset App',
    },
  ];

  const handleClick = async (index: number) => {
    if (index === 0) {
      navigation.navigate('AboutScreen');
    }
    if (index === 2) {
      navigation.navigate('QRSessionScreen');
    }
    if (index === 5) {
      setModalVisible(!modalVisible);
    }
    if (index === 3) {
      let isPermissionsGranted = await checkAndRequestPermissions();
      if (isPermissionsGranted) {
        DemoAppModule.StartLiveScan();
      }
    }
    if (index === 4) {
      navigation.navigate('Fido2Screen');
    }
  };

  const renderItem = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity
      key={index}
      style={styles.buttonStyle}
      onPress={() => handleClick(index)}>
      <Text style={styles.buttonText}>{item.title}</Text>
      {index === 1 && (
        <Image
          source={require('../../assets/greenTick.png')}
          style={styles.tickImageStyle}
        />
      )}
    </TouchableOpacity>
  );
  const handleOkPress = () => {
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
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />
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
