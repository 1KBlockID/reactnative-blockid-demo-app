import React, {useState} from 'react';
import {Text, TouchableOpacity, View, Alert, Platform} from 'react-native';
import {styles} from './style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../RootStackParams';
import {CustomStatusBar} from '../../components/StatusBar/CustomStatusBar';
import {Loader} from '../../components/loader';
import ScopeData from '../../helper/ScopeData';
import {
  authenticateUserAndroid,
  onUserAuthenticate,
} from '../../connector/QRScanner';
import {Strings} from '../../constants/Strings';
import { Colors } from '../../constants/Colors';


type Props = NativeStackScreenProps<RootParamList, 'AuthenticateScreen'>;
function AuthenticateScreen({navigation}: Props): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const scopeData: any = ScopeData.getScopeData();
  let newScopeData;
  if (Platform.OS === 'android') {
    newScopeData = JSON.parse(scopeData);
  }
  const sessionData: any = ScopeData.getSessionData();

  const navigateToHomeScreen = () => {
    Alert.alert(Strings.Successfully_Authenticated_Text);
    navigation.navigate('MenuScreen');
  };

  /**
   * Authenticate user Functionality
   */

  const onAuthenticate = () => {
    setIsLoading(true);
    if (Platform.OS === 'ios') {
      onUserAuthenticate(sessionData).then(response => {
        setIsLoading(false);
        if (response === true) {
          navigateToHomeScreen();
        } else {
          Alert.alert(response as string);
          navigation.navigate('MenuScreen');
        }
      });
    } else {
      let newData = JSON.parse(sessionData);
      authenticateUserAndroid(newData).then(response => {
        if (response === true) {
          navigateToHomeScreen();
        } else {
          Alert.alert(response as string);
          navigation.navigate('MenuScreen');
        }
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <CustomStatusBar backgroundColor={Colors.black} barTextColor={'light-content'} />
          {scopeData && (
            <Text style={styles.listText}>
              {Strings.Did} :{' '}
              {Platform.OS === 'ios' ? scopeData?.did : newScopeData?.did}
            </Text>
          )}
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.authenticateButton}
              onPress={onAuthenticate}>
              <Text style={styles.authenticateText}>
                {Strings.Authenticate}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
}

export default AuthenticateScreen;
