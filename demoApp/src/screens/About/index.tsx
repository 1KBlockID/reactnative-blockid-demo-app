import React, {useEffect, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import {styles} from './style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../RootStackParams';
import {CustomStatusBar} from '../../components/StatusBar/CustomStatusBar';
import DeviceInfo from 'react-native-device-info';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import {Images} from '../../constants/Images';
import {Strings} from '../../constants/Strings';

type Props = NativeStackScreenProps<RootParamList, 'AboutScreen'>;

function AboutScreen({navigation}: Props): JSX.Element {
  const version = DeviceInfo.getVersion();
  const {DemoAppModule} = NativeModules;
  const [sdkResponse, setSdkResponse] = useState<any>('');

  const getInfo = async () => {
    const response = await DemoAppModule.getSDKInfo();
    __DEV__ && console.log('response', response);
    let sdkInfo = response;
    if (Platform.OS === 'android') {
      sdkInfo = JSON.parse(response);
    }

    let AboutScreenText = `Root Tenant : \nDNS: ${sdkInfo.tenant.dns} \nTag :${sdkInfo.tenant.tenantTag}\ncommunity : ${sdkInfo.tenant.community}\n(${sdkInfo.tenant.communityId}) \n
Client Tenant: \nDNS: ${sdkInfo.clientTenant.dns} \nTag :${sdkInfo.tenant.tenantTag} \ncommunity :${sdkInfo.clientTenant.community} \n License Key:\n ${sdkInfo.licenseKey} \n\nDID:\n${sdkInfo.DID}\n
Public Key :
${sdkInfo.publicKey} \n\nSDK Version: \n${sdkInfo.SdkVersion}\n 
App Version:\n${version}`;
    setSdkResponse(AboutScreenText);
  };

  useEffect(() => {
    getInfo();
  }, []);

  const copyToClipboard = () => {
    Clipboard.setString(sdkResponse);
    Toast.show({
      text2: 'Text Copied',
      position: 'bottom',
      type: 'info',
    });
  };

  return (
    <>
      <CustomStatusBar />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={Images.backArrow}
              style={styles.backArrow}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>{Strings.About}</Text>
        </View>
        {sdkResponse && (
          <ScrollView>
            <Text style={styles.textStyle}>{sdkResponse}</Text>
          </ScrollView>
        )}
        <TouchableOpacity
          style={styles.copyContainer}
          onPress={() => copyToClipboard()}>
          <Text style={styles.copyText}>{Strings.Copy}</Text>
        </TouchableOpacity>
        <Toast />
      </View>
    </>
  );
}

export default AboutScreen;
