import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  NativeModules,
  Alert,
} from 'react-native';
import {styles} from './style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../RootStackParams';
import {CustomStatusBar} from '../../components/StatusBar/CustomStatusBar';
import {Loader} from '../../components/loader';
import ScopeData, {
  scopeDataResponseType,
  sessionDataResponseType,
} from '../../helper/ScopeData';

type Props = NativeStackScreenProps<RootParamList, 'AuthenticateScreen'>;
function AuthenticateScreen({navigation}: Props): JSX.Element {
  const {DemoAppModule} = NativeModules;
  const [isLoading, setIsLoading] = useState(false);
  const scopeData: scopeDataResponseType = ScopeData.getScopeData();
  const sessionData: sessionDataResponseType = ScopeData.getSessionData();

  const onAuthenticate = () => {
    setIsLoading(true);
    // let data = ScopeData.getSessionData();
    console.log('data ', sessionData);
    DemoAppModule.authenticateUser(
      scopeData?.userId ?? '',
      sessionData?.session ?? '',
      sessionData?.creds ?? '',
      sessionData?.scopes ?? '',
      sessionData?.sessionUrl,
      sessionData?.tag ?? '',
      sessionData?.name ?? '',
    )
      .then((response: any) => {
        __DEV__ && console.log('response 1', response);
        if (response === true) {
          // status is true here
          Alert.alert('You have successfully authenticated to Log In');
          navigation.navigate('MenuScreen');
        } else {
          Alert.alert(response);
          __DEV__ && console.log('response', response);
          setIsLoading(false);
          navigation.navigate('MenuScreen');
        }
      })
      .catch((error: any) => {
        __DEV__ && console.log('error', error);
      });
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <CustomStatusBar />
          {scopeData && (
            <Text style={styles.listText}>Did : {scopeData?.did}</Text>
          )}
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.authenticateButton}
              onPress={onAuthenticate}>
              <Text style={styles.authenticateText}>Authenticate</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
}

export default AuthenticateScreen;
