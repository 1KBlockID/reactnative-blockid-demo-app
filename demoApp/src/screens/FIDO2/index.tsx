import React from 'react';
import {
  FlatList,
  Image,
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

type Props = NativeStackScreenProps<RootParamList, 'Fido2Screen'>;

type Item = {
  id: number;
  title: String;
};

function Fido2Screen({navigation}: Props): JSX.Element {
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

  const handleButtonClick = (index: number) => {};

  const renderItem = ({item, index}: {item: Item; index: number}) => (
    <TouchableOpacity
      key={index}
      style={styles.buttonContainer}
      onPress={() => handleButtonClick(index)}>
      <Text style={styles.buttonTextStyle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
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
            <TextInput style={styles.textInputStyle} placeholder="Username" />
            <View style={styles.buttonContainer1}>
              <TouchableOpacity
                style={{width: '45%', backgroundColor: 'black', padding: 15}}>
                <Text style={{textAlign: 'center', color: 'white'}}>
                  Register(Web)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{width: '45%', backgroundColor: 'black', padding: 15}}>
                <Text style={{textAlign: 'center', color: 'white'}}>
                  Register(Web)
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList data={ButtonText} renderItem={renderItem} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Fido2Screen;
