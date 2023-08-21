import React, {useEffect, useState} from 'react';
import {
  FlatList,
  NativeEventEmitter,
  NativeModules,
  Platform,
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
import {checkAndRequestPermissions} from '../../utils/Permissions';
import { CustomStatusBar } from '../../components/StatusBar/CustomStatusBar';

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

  /**
   * handle QR Scan functionality
   */

  const handleQRLogin = async (actionType: string) => {
    if (actionType === Strings.ORSession1) {
      if (checkAndRequestPermissions()) {
        DemoAppModule.scanQRCode();
      }
    } else {
      //QR Scan with Preset Data
    }
  };

  const renderItem = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity
      style={styles.btnContainer}
      onPress={() => handleQRLogin(item.buttonText)}>
      <Text style={styles.btnTextStyle}>{item.buttonText}</Text>
    </TouchableOpacity>
  );

  const handleSuccess = (res: any) => {
    ScopeData.addScopeData(res);
    navigation.navigate('AuthenticateScreen');
    setIsLoading(false);
  };

  useEffect(() => {
    checkAndRequestPermissions();
    const eventEmitter = new NativeEventEmitter(
      Platform.OS === 'ios'
        ? NativeModules.RNEventEmitter
        : NativeModules.DemoAppModule,
    );

    /**
     * handle QR Scan response
     */
    let eventListener = eventEmitter.addListener('OnQRScanResult', event => {
      if (event) {
        setIsLoading(true);

        /**
         * get Scope Data api
         */
        ScopeData.addSessionData(event);
        if (Platform.OS === 'ios') {
          DemoAppModule.getScopeData(
            event?.scope ?? "",
            event?.creds ?? '',
            event?.userId ?? '',
          )
            .then((response: any) => {
              handleSuccess(response);
            })
            .catch((error: any) => {
              setIsLoading(false);
            });
        } else {
          DemoAppModule.getScopeData(event?.scopes ?? '', event?.creds ?? '')
            .then((response: any) => {
              handleSuccess(response);
            })
            .catch((error: any) => {
              setIsLoading(false);
            });
        }
      }
    });
    return () => eventListener.remove();
  }, []);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          <CustomStatusBar
            backgroundColor={Colors.black}
            barTextColor="light-content"
          />
          <FlatList data={ButtonText} renderItem={renderItem} />
        </View>
      )}
    </>
  );
}

export default QRSessionScreen;
