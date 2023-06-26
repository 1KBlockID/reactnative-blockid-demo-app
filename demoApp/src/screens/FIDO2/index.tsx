import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  NativeModules,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../RootStackParams';
import {Colors} from '../../constants/Colors';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootParamList, 'Fido2Screen'>;

type Item = {
  id: number;
  title: String;
};

function Fido2Screen({navigation}: Props): JSX.Element {
  const [userName, setUserName] = useState('');
  const [loader, setLoader] = useState<boolean>(false);
  const [pin, setPin] = useState<string>('');
  const {DemoAppModule} = NativeModules;
  const ButtonText = [
    {
      id: 1,
      title: 'Register (Platform Authenticator)',
    },
    {
      id: 2,
      title: 'Authenticate (Platform Authenticator)',
    },
    {
      id: 3,
      title: 'Register (Security key)',
    },
    {
      id: 4,
      title: 'Authenticate (Security Authenticator)',
    },
  ];

  const registerUserKey = () => {
    DemoAppModule.registerUserKey(userName)
      .then((res: string) => {
        console.log('Response', res);
      })
      .catch((error: unknown) => {
        setLoader(false);
        Alert.alert(JSON.stringify(error));
      });
  };

  const authenticateUserKey = () => {
    DemoAppModule.authenticateUserKey(userName)
      .then((res: string) => {
        console.log('Response', res);
      })
      .catch((error: unknown) => {
        setLoader(false);
        Alert.alert(JSON.stringify(error));
      });
  };

  const registerCardKey = () => {
    DemoAppModule.registerCardKey(userName, '1234')
      .then((res: string) => {
        console.log('res', res);
      })
      .catch((error: unknown) => {
        setLoader(false);
        Alert.alert(JSON.stringify(error));
      });
  };

  const authenticateCardKey = () => {
    DemoAppModule.authenticateCardKey(userName, '1234')
      .then((res: string) => {
        console.log('res', res);
      })
      .catch((error: unknown) => {
        setLoader(false);
        Alert.alert(JSON.stringify(error));
      });
  };

  const handleButtonClick = (index: number) => {
    if (!userName) {
      Toast.show({
        type: 'error',
        text1: 'Please Enter userName',
      });
      return;
    }
    setLoader(true);
    if (index === 0) {
      registerUserKey();
    } else if (index === 1) {
      authenticateUserKey();
    } else if (index == 2) {
      registerCardKey();
    } else {
      authenticateCardKey();
    }
  };

  const renderItem = ({item, index}: {item: Item; index: number}) => (
    <TouchableOpacity
      key={index}
      style={styles.buttonContainer}
      onPress={() => handleButtonClick(index)}>
      <Text style={styles.buttonTextStyle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const webRegistration = () => {
    if (!userName) {
      Toast.show({
        type: 'error',
        text1: 'Please Enter userName',
      });
      return;
    }
    setLoader(true);
    DemoAppModule.register(userName)
      .then((response: String) => {
        console.log('response', response);
      })
      .catch((error: unknown) => {
        setLoader(false);
        Alert.alert(JSON.stringify(error));
      });
  };

  const webAuthentication = () => {
    if (!userName) {
      Toast.show({
        type: 'error',
        text1: 'Please Enter userName',
      });
      return;
    }
    setLoader(true);
    DemoAppModule.authenticate(userName)
      .then((response: String) => {
        console.log('response', response);
      })
      .catch((error: unknown) => {
        setLoader(false);
        Alert.alert(JSON.stringify(error));
      });
  };
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
      {loader && (
        <View style={styles.loaderContainer}>
          <View style={styles.indicatorContainer}>
            <ActivityIndicator color={'#B80F0A'} size={'large'} />
          </View>
        </View>
      )}

      <ScrollView nestedScrollEnabled={true}>
        <View style={styles.mainContainer}>
          <View style={styles.headerView}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/backarrow.png')}
                style={styles.backArrow}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Image
              source={require('../../assets/logoWithoutPadding.png')}
              style={styles.logoContainer}
              resizeMode="contain"
            />
            <View style={styles.backArrow} />
          </View>
          <View style={styles.bottomView}>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Username"
              value={userName}
              onChangeText={value => {
                setUserName(value);
              }}
            />
            <View style={styles.buttonContainer1}>
              <TouchableOpacity
                style={styles.touchableContainer}
                onPress={webRegistration}>
                <Text style={styles.btnText}>Register(Web)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={webAuthentication}
                style={styles.touchableContainer}>
                <Text style={styles.btnText}>Authenticate (Web)</Text>
              </TouchableOpacity>
            </View>
            <FlatList data={ButtonText} renderItem={renderItem} />
          </View>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}

export default Fido2Screen;
