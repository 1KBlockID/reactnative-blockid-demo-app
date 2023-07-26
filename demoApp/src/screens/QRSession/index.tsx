import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  NativeEventEmitter,
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
import {Strings} from '../../constants/Strings';
import ScopeData from '../../helper/ScopeData';
import {Loader} from '../../components/loader';

type Props = NativeStackScreenProps<RootParamList, 'QRSessionScreen'>;

function QRSessionScreen({navigation}: Props): JSX.Element {
  const {DemoAppModule} = NativeModules;
  const [isLoading, setIsLoading] = useState(false);
  const ButtonText = [
    {
      id: 1,
      buttonText: Strings.ORSession1,
    },
    {
      id: 2,
      buttonText: Strings.ORSession2,
    },
  ];

  const handleQRLogin = (actionType: string) => {
    if (actionType === Strings.ORSession1) {
      DemoAppModule.ScanQRCode();
    } else {
      Alert.alert('Second  tab');
    }
  };

  const renderItem = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity
      style={styles.btnContainer}
      onPress={() => handleQRLogin(item.buttonText)}>
      <Text style={styles.btnTextStyle}>{item.buttonText}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.RNEventEmitter);
    let eventListener = eventEmitter.addListener('OnQRScanResult', event => {
      if (event) {
        setIsLoading(true);
        __DEV__ && console.log('OnQRScanResult', event); //
        ScopeData.addSessionData(event);
        DemoAppModule.getScopeData(
          event?.scope ?? '',
          event?.creds ?? '',
          event?.userId ?? '',
        )
          .then((response: any) => {
            __DEV__ && console.log('scope data', event);
            ScopeData.addScopeData(response);
            navigation.navigate('AuthenticateScreen');
            setIsLoading(false);
          })
          .catch((error: any) => {
            setIsLoading(false);
            __DEV__ && console.log('error when getting scope data ', error);
          });
      }
    });
    return () => eventListener.remove();
  }, []);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
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
            <FlatList data={ButtonText} renderItem={renderItem} />
          </View>
        </>
      )}
    </>
  );
}

export default QRSessionScreen;
