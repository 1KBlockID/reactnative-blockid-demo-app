import React, {useState} from 'react';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../RootStackParams';
import {Colors} from '../../constants/Colors';
import {PinModal} from '../../components/PinModal';
import {Strings} from '../../constants/Strings';
import {Images} from '../../constants/Images';
import {Fido2Error, Fido2PayloadModel} from '../../constants/Fido2PayloadModel';
import {
  changeFIDO2PIN,
  resetFIDO2,
  setFIDO2PIN,
} from '../../connector/Fido2Connector';
import { CustomStatusBar } from '../../components/StatusBar/CustomStatusBar';
import { ErrorCodes } from '../../constants/ErrorCodes';

type Props = NativeStackScreenProps<RootParamList, 'PinScreen'>;

function PinScreen({navigation}: Props): JSX.Element {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isChangePin, setIsChangePin] = useState<boolean>(false);
  const [isResetFido, setIsResetFido] = useState<boolean>(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validationCheck = async (): Promise<boolean> => {
    if (pin.length < 4) {
      setErrorMessage(Strings.PleaseEnterValidPin);
      return false;
    } else {
      if (pin !== confirmPin) {
        setErrorMessage(Strings.PinsDoNotMatch);
        return false;
      }
      return true;
    }
  };

  const handleResetStates = () => {
    setModalVisible(false);
    setIsChangePin(false);
    setIsResetFido(false);
    setConfirmPin('');
    setPin('');
    setCurrentPin('');
    setErrorMessage('');
  };

  const errorHandler = (error: Fido2Error): void => {
    Alert.alert(`${error?.message} ${error?.code}`, 'Please try again.', [
      {
        text: 'OK',
        onPress: async () => {
          handleResetStates();
        },
      },
    ]);
  };
  // Change FIDO2 Pin Error handler
  const changePinErrorHandler = (error: Fido2Error): void => {
    if (Number(error?.code) === Number(ErrorCodes.PINInvalid)) {
      Alert.alert(`${error?.message} ${error?.code}`, 'Enter Pin Again.', [
        {
          text: 'OK',
          onPress: async () => {
            handleResetStates;
          },
        },
      ]);
    } else {
      Alert.alert(`${error?.message} ${error?.code}`, 'Please try again.', [
        {
          text: 'OK',
          onPress: async () => {
            handleResetStates();
          },
        },
      ]);
    }
  };

  const resetPinErrorHandler = (error: Fido2Error): void => {
    if (Number(error?.code) === Number(ErrorCodes.PINInvalid)) {
      Alert.alert(`${error?.message} ${error?.code}`, 'Enter Pin Again.', [
        {
          text: 'OK',
          onPress: async () => {
            setConfirmPin('');
            setCurrentPin('');
            setPin('');
          },
        },
      ]);
    } else {
      Alert.alert(`${error?.message} ${error?.code}`, 'Please try again.', [
        {
          text: 'OK',
          onPress: async () => {
            setConfirmPin('');
            setCurrentPin('');
            setPin('');
          },
        },
      ]);
    }
  };
  const payload = {
    errorHandler:
      currentPin === '' && !isResetFido
        ? errorHandler
        : isResetFido
        ? resetPinErrorHandler
        : changePinErrorHandler,
    pin: pin,
    currentPin: currentPin,
  } as Fido2PayloadModel;

  //setFIDO2 Pin
  async function setFidoKey() {
    const pinResponse = await setFIDO2PIN(payload);
    if (pinResponse) {
      Alert.alert('Pin set Successfully');
      handleResetStates();
    }
  }
  //changeFIDO2 Pin
  async function changeFidoKey() {
    const pinResponse = await changeFIDO2PIN(payload);
    if (pinResponse === 'OK') {
      Alert.alert('Pin Changed Successfully');
      handleResetStates();
    }
  }

  //Reset Pin functionality
  const handleResetPin = async () => {
    const resetResponse = await resetFIDO2(payload);
    if (resetResponse === 'OK') {
      Alert.alert('Pin Reset Successfully');
      handleResetStates();
    }
  };

  const buttonText = [
    {id: 1, name: Strings.SetPin},
    {id: 2, name: Strings.ChangePin},
    {id: 3, name: Strings.ResetFIDO},
  ];

  const handleDonePress = async () => {
    if (isResetFido) {
      handleResetPin();
    } else {
      let isValidData = await validationCheck();
      if (isValidData) {
        if (currentPin === '' && !isResetFido) {
          setFidoKey();
        } else {
          changeFidoKey();
        }
      }
    }
  };

  const handleButtonClick = (index: number, actionType: String) => {
    setModalVisible(true);
    if (actionType === Strings.ChangePin) setIsChangePin(true);
    else if (actionType === Strings.ResetFIDO) {
      setIsResetFido(true);
    }
  };

  return (
    <View style={styles.container}>
      <CustomStatusBar
        backgroundColor={Colors.white}
        barTextColor={"dark-content"}
      />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backArrowContainer}
        >
          <Image
            source={Images.backArrow}
            style={styles.backArrow}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>{Strings.FIDO2PINManagement}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {buttonText.map((item: any, index: number) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                handleButtonClick(index, item.name);
              }}
              style={[
                styles.buttonTouchable,
                { backgroundColor: index === 2 ? Colors.peach : Colors.black },
                { marginTop: index === 2 ? 25 : 5 },
              ]}>
              <Text style={styles.buttonText}>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <PinModal
        isModalVisible={modalVisible}
        isChangePin={isChangePin}
        handleDoneClick={() => handleDonePress()}
        handleCancelClick={handleResetStates}
        setCurrentPin={setCurrentPin}
        setPin={setPin}
        setConfirmPin={setConfirmPin}
        pin={pin}
        confirmPin={confirmPin}
        currentPin={currentPin}
        isResetFido={isResetFido}
        errorMsg={errorMessage}
      />
    </View>
  );
}

export default PinScreen;
