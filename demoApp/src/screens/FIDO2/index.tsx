import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  SafeAreaView,
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
import {Strings} from '../../constants/Strings';
import {Images} from '../../constants/Images';
import {DialogBox} from '../../components/DialogBox';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getData, storeData} from '../../databaseService/localStorage';

type Props = NativeStackScreenProps<RootParamList, 'Fido2Screen'>;

type Item = {
  id: number;
  title: String;
};
type Error = {
  userInfo?: string;
  message?: string;
};
function Fido2Screen({navigation}: Props): JSX.Element {
  const [userName, setUserName] = useState('');
  const [loader, setLoader] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isPinRequired, setIsPinRequired] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const {DemoAppModule} = NativeModules;
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
  const ButtonText = [
    {
      id: 1,
      title: Strings.Register_PlatForm,
    },
    {
      id: 2,
      title: Strings.Authenticate_Platform,
    },
    {
      id: 3,
      title: Strings.Register_Security_key,
    },
    {
      id: 4,
      title: Strings.Authenticate_Security_key,
    },
    {
      id: 5,
      title: Strings.Register_Security_With_Pin,
    },
    {
      id: 6,
      title: Strings.Authenticate_Security_With_Pin,
    },
  ];

  const SuccessAlert = (message: string) => {
    Alert.alert('SUCCESS', message);
  };

  /**
   * register through key
   */

  const registerCardKey = () => {
    if (Platform.OS === 'ios' && pin !== '') {
      DemoAppModule.registerFIDO2(userName, 'cross-platform', pin)
        .then((res: string) => {
          __DEV__ && console.log('res', res);
          if (res === 'OK') {
            storeData(userName, 'userName');
            SuccessAlert('Security key registered successfully.');
            setPin('');
            setLoader(false);
          }
        })
        .catch((error: Error) => {
          setLoader(false);
          setPin('');
          Alert.alert(JSON.stringify(error?.message ?? error));
        });
    }

    // else {
    //   DemoAppModule.registerFIDO2(userName, 'cross-platform', '')
    //     .then((res: string) => {
    //       if (res === 'OK') {
    //         storeData(userName, 'userName');
    //         SuccessAlert('Security key registered successfully.');
    //         setLoader(false);
    //       }
    //     })
    //     .catch((error: Error) => {
    //       setLoader(false);
    //       Alert.alert(JSON.stringify(error?.message ?? error));
    //     });
    // }
  };

  /**
   * authenticate through Key
   */
  const authenticateCardKey = () => {
    //Check pin for IOS
    if (Platform.OS === 'ios' && pin !== '') {
      DemoAppModule.authenticateFIDO2(userName, 'cross-platform', pin)
        .then((res: string) => {
          __DEV__ && console.log('res', res);
          if (res === 'OK') {
            SuccessAlert('Security key is authenticated successfully.');
            setLoader(false);
            setPin('');
          }
        })
        .catch((error: Error) => {
          setLoader(false);
          setPin('');
          Alert.alert(JSON.stringify(error?.message ?? error));
        });
    }
    // else {
    //   DemoAppModule.authenticateFIDO2Key(userName, 'cross-platform', '')
    //     .then((res: string) => {
    //       if (res === 'OK') {
    //         SuccessAlert('Security key is authenticated successfully.');
    //         setLoader(false);
    //       }
    //     })
    //     .catch((error: Error) => {
    //       setLoader(false);
    //       Alert.alert(JSON.stringify(error?.message ?? error));
    //     });
    // }
  };

  /**
   * FIDO2 registration
   */
  const registerFIDO2 = (keyType?: string) => {
    if (keyType === 'platform') {
      DemoAppModule.registerFIDO2(userName, keyType, '')
        .then((res: string) => {
          __DEV__ && console.log('registerUserKey', res);
          setLoader(false);
          if (res === 'OK') {
            storeData(userName, 'userName');
            SuccessAlert('Platform key registered successfully.');
          }
        })
        .catch((error: Error) => {
          setLoader(false);
          Alert.alert(JSON.stringify(error?.message ?? error));
        });
    } else {
      DemoAppModule.registerFIDO2(userName, keyType, '')
        .then((res: string) => {
          __DEV__ && console.log('registerUserKey', res);
          setLoader(false);
          if (res === 'OK') {
            storeData(userName, 'userName');
            SuccessAlert('Platform key registered successfully.');
          }
        })
        .catch((error: Error) => {
          setLoader(false);
          Alert.alert(JSON.stringify(error?.message ?? error));
        });
    }
  };

  /**
   * FIDO2 authentication
   */
  const authenticateFIDO2Key = (keyType?: string) => {
    if (keyType == 'platform') {
      DemoAppModule.authenticateFIDO2(userName, keyType, '')
        .then((res: string) => {
          setLoader(false);
          if (res === 'OK') {
            storeData(userName, 'userName');
            SuccessAlert('Platform key authenticated successfully.');
          }
        })
        .catch((error: Error) => {
          setLoader(false);
          Alert.alert(JSON.stringify(error?.message ?? error));
        });
    } else {
      DemoAppModule.authenticateFIDO2(userName, keyType, '')
        .then((res: string) => {
          setLoader(false);
          if (res === 'OK') {
            storeData(userName, 'userName');
            SuccessAlert('Platform key authenticated successfully.');
          }
        })
        .catch((error: Error) => {
          setLoader(false);
          Alert.alert(JSON.stringify(error?.message ?? error));
        });
    }
  };

  const isUsernameExists = () => {
    if (!userName) {
      Toast.show({
        type: 'error',
        text1: 'Please Enter userName',
      });
      return false;
    }
    return true;
  };

  const handleButtonClick = (index: number, action: String) => {
    if (isUsernameExists()) {
      setLoader(true);
      if (action === Strings.Register_PlatForm) {
        registerFIDO2('platform');
      } else if (action === Strings.Authenticate_Platform) {
        authenticateFIDO2Key('platform');
      } else if (action === Strings.Register_Security_key) {
        registerFIDO2('cross-platform');
      } else if (action === Strings.Authenticate_Security_key) {
        authenticateFIDO2Key('cross-platform');
      } else if (action === Strings.Register_Security_With_Pin) {
        setModalVisible(true);
        setActiveIndex(Strings.Register_Security_With_Pin);
      } else {
        setModalVisible(true);
        setActiveIndex(Strings.Authenticate_Security_With_Pin);
      }
    }
  };

  /**
   * Remove spaces from name
   */
  const removeSpaces = (userName: string) => {
    const name = userName;
    const withoutSpace = name.replace(/ /g, '');
    console.log(withoutSpace);
    return withoutSpace;
  };

  const renderItem = ({item, index}: {item: Item; index: number}) => {
    return index <= 3 || Platform.OS === 'ios' ? (
      <TouchableOpacity
        key={index}
        style={styles.buttonContainer}
        onPress={() => handleButtonClick(index, item.title)}>
        <Text style={styles.buttonTextStyle}>{item.title}</Text>
      </TouchableOpacity>
    ) : null;
  };

  /**
   * register through web
   */
  const webRegistration = () => {
    if (isUsernameExists()) {
      setLoader(true);
      DemoAppModule.registerFIDO2KeyUsingWeb(
        Platform.OS === 'ios' ? removeSpaces(userName) : userName,
      )
        .then((response: String) => {
          if (response === 'OK') {
            storeData(userName, 'userName');
            SuccessAlert('Your FIDO2 key has been successfully registered.');
            setLoader(false);
          }
        })
        .catch((error: Error) => {
          setLoader(false);
          Alert.alert(JSON.stringify(error?.message ?? error));
        });
    }
  };

  /**
   * authenticate through web
   */
  const webAuthentication = () => {
    if (isUsernameExists()) {
      setLoader(true);
      DemoAppModule.authenticateFIDO2KeyUsingWeb(
        Platform.OS === 'ios' ? removeSpaces(userName) : userName,
      )
        .then((response: String) => {
          if (response === 'OK') {
            storeData(userName, 'userName');
            SuccessAlert(
              'You have successfully authenticated with your FIDO2 key.',
            );
            setLoader(false);
          }
        })
        .catch((error: Error) => {
          setLoader(false);
          Alert.alert(JSON.stringify(error?.message ?? error));
        });
    }
  };

  const handleCancelClick = () => {
    setModalVisible(false);
    if (isPinRequired && activeIndex === Strings.Register_Security_With_Pin) {
      registerCardKey();
    } else if (
      isPinRequired &&
      activeIndex === Strings.Authenticate_Security_With_Pin
    ) {
      authenticateCardKey();
    }
  };

  const handleOKClick = () => {
    setLoader(false);
    setModalVisible(false);
  };

  useEffect(() => {
    getData('userName').then(async res => {
      if (res) {
        setUserName(JSON.parse(res));
      }
    });
  }, []);
  return (
    <KeyboardAwareScrollView
      style={styles.keyBoardContainer}
      contentInsetAdjustmentBehavior="always"
      keyboardShouldPersistTaps={'always'}>
      <SafeAreaView style={styles.safeAreaContainer}>
        {loader && (
          <View style={styles.loaderContainer}>
            <View style={styles.indicatorContainer}>
              <ActivityIndicator color={Colors.red} size={'large'} />
            </View>
          </View>
        )}
        <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />

        <View style={styles.headerView}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.arrowContainer}>
            <Image
              source={Images.backArrow}
              style={styles.backArrow}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Image
            source={Images.logoWithoutPadding}
            style={styles.logoContainer}
            resizeMode="contain"
          />
          <View style={styles.backArrow} />
        </View>

        <View style={styles.mainContainer}>
          <KeyboardAvoidingView
            behavior="height"
            keyboardVerticalOffset={keyboardVerticalOffset}
            style={{flex: 1}}>
            <View style={styles.bottomView}>
              <TextInput
                style={styles.textInputStyle}
                placeholder={Strings.Username}
                placeholderTextColor={Colors.gray}
                value={userName}
                onChangeText={value => {
                  setUserName(value);
                }}
              />

              <View style={styles.buttonContainer1}>
                <TouchableOpacity
                  style={styles.touchableContainer}
                  onPress={webRegistration}>
                  <Text style={styles.btnText}>{Strings.Register_web}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={webAuthentication}
                  style={styles.touchableContainer}>
                  <Text style={styles.btnText}>{Strings.Authenticate_Web}</Text>
                </TouchableOpacity>
              </View>

              <FlatList data={ButtonText} renderItem={renderItem} />
            </View>
          </KeyboardAvoidingView>
        </View>

        <Toast />
        <DialogBox
          isModalVisible={modalVisible}
          handleOkClick={() => handleOKClick()}
          handleCancelClick={handleCancelClick}
          isPinRequired={isPinRequired}
          pin={pin}
          setPin={setPin}
        />
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

export default Fido2Screen;
