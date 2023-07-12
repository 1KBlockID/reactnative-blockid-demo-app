import React from 'react';
import {
  Alert,
  FlatList,
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
import { qrLogin } from '../../connector/QRLogin';

type Props = NativeStackScreenProps<RootParamList, 'QRSessionScreen'>;

function QRSessionScreen({navigation}: Props): JSX.Element {
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
      qrLogin()
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
        <FlatList data={ButtonText} renderItem={renderItem} />
      </View>
    </>
  );
}

export default QRSessionScreen;
