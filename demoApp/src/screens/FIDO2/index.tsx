import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
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
import { CustomStatusBar } from '../../components/StatusBar/CustomStatusBar';
import { authenticateFIDO2, handleAuthenticationFIDO2KeyUsingWeb, handleRegisterFIDO2KeyUsingWeb, registerFIDO2Key } from '../../connector/RegisterFIDO2Connector';

type Props = NativeStackScreenProps<RootParamList, 'Fido2Screen'>;

type Item = {
  id: number;
  title: String;
};

function Fido2Screen({ navigation }: Props): JSX.Element {
  const [userName, setUserName] = useState('');
  const [loader, setLoader] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isPinRequired, setIsPinRequired] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<string>('');
  const [pin, setPin] = useState<string>('');
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
    const response = registerFIDO2Key(userName, pin, 'cross-platform');
    if (response === true) {
      SuccessAlert('Platform key registered successfully.');
      setPin('')
      setLoader(false);
    }
    else {
      setPin('')
      setLoader(false);
    }
  };

  /**
   * authenticate through Key
   */
  const authenticateCardKey = async () => {
    //Check pin for IOS
    const response = await authenticateFIDO2(userName, pin, 'cross-platform');
    if (response === true) {
      SuccessAlert('Security key is authenticated successfully.');
      setLoader(false);
    } else {
      setPin('')
      setLoader(false);
    }
  };

  /**
   * FIDO2 registration
   */
  const registerFIDO2 = async (keyType?: string) => {
    let name= userName;
    if(Platform.OS === 'ios'){
      name= removeSpaces(userName)
    }
    const response = await registerFIDO2Key(name, pin, keyType );
   if(response === true){
     SuccessAlert('Platform key registered successfully.');
     setLoader(false);
   } else {
     setLoader(false);
   }
  };

  /**
   * FIDO2 authentication
   */
  const authenticateFIDO2Key = async (keyType?: string) => {
    const response = await authenticateFIDO2(userName, pin, keyType);
    if(response === true){
      SuccessAlert('Platform key authenticated successfully.');
      setLoader(false);
    } else {
      setLoader(false);
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
  const webRegistration = async () => {
    if (isUsernameExists()) {
      setLoader(true);
     const response= await handleRegisterFIDO2KeyUsingWeb(userName);
      if (response === true) {
        setLoader(false);
        SuccessAlert('Your FIDO2 key has been successfully registered.');
      }
      else{
        setLoader(false);
      }
    }
  };

  /**
   * authenticate through web
   */
  const webAuthentication = async () => {
    if (isUsernameExists()) {
      setLoader(true);
      const response = await handleAuthenticationFIDO2KeyUsingWeb(userName);
      if (response === true) {
       setLoader(false);
        SuccessAlert('You have successfully authenticated with your FIDO2 key.');
      }
      else {
        setLoader(false);
      }
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
      {loader && (
        <View style={styles.loaderContainer}>
          <View style={styles.indicatorContainer}>
            <ActivityIndicator color={Colors.red} size={"large"} />
          </View>
        </View>
      )}
      <CustomStatusBar
        backgroundColor={Colors.white}
        barTextColor="dark-content"/>

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
          style={{ flex: 1 }}>
          <View style={styles.bottomView}>
            <TextInput
              style={styles.textInputStyle}
              placeholder={Strings.Username}
              placeholderTextColor={Colors.gray}
              value={userName}
              onChangeText={(value) => {
                setUserName(value);
              }}
            />

            <View style={styles.buttonContainer1}>
              <TouchableOpacity
                style={styles.touchableContainer}
                onPress={webRegistration}
              >
                <Text style={styles.btnText}>{Strings.Register_web}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={webAuthentication}
                style={styles.touchableContainer}
              >
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
    </KeyboardAwareScrollView>
  );
}

export default Fido2Screen;
