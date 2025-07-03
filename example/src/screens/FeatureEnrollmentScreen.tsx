import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import type { RootStackParamList } from '../RootStackParam';
import type { RouteProp } from '@react-navigation/native';
import HomeViewModel from '../HomeViewModel';
import { DocType } from '../../../src/WrapperModel';
import SpinnerOverlay from '../SpinnerOverlay';
import liveId from '../../assets/liveid.png';
import qr from '../../assets/qr.png';
import totp from '../../assets/TOTP.png';
import idCard from '../../assets/idcard.png';
import driverlicense from '../../assets/driverlicense.png';
import sdk from '../../assets/sdk.png';
import type { FeatureEnrollmentScreenNavigationProp } from '../Navprops';

type FeatureEnrollmentScreenRouteProp = RouteProp<
  RootStackParamList,
  'Featurelist'
>;

type Props = {
  navigation: FeatureEnrollmentScreenNavigationProp;
  route: FeatureEnrollmentScreenRouteProp;
};

enum FeatureIdentifier {
  TOTP = 'totp',
  NationalID = 'nationalid',
  DrivingLicence = 'drivinglicence',
  Passport = 'passport',
  LiveID = 'liveid',
  QRScan = 'qrscan',
  Reset = 'reset',
  LiveIDVerification = 'liveidverification',
}

interface Feature {
  title: string;
  desc: string;
  id: FeatureIdentifier;
  icon: any;
}

const features: Feature[] = [
  {
    title: 'One-time Passcode',
    desc: 'Generate a passcode for MFA ',
    icon: totp,
    id: FeatureIdentifier.TOTP,
  },
  {
    title: 'ID Card ',
    desc: 'Scan and verify an ID card  ',
    icon: idCard,
    id: FeatureIdentifier.NationalID,
  },
  {
    title: 'Driver’s License',
    desc: 'Scan and verify a driver’s license',
    icon: driverlicense,
    id: FeatureIdentifier.DrivingLicence,
  },
  {
    title: 'Passport',
    desc: 'Scan and verify a passport',
    icon: idCard,
    id: FeatureIdentifier.Passport,
  },
  {
    title: 'LiveID',
    desc: 'Enroll a face to check for liveness',
    icon: liveId,
    id: FeatureIdentifier.LiveID,
  },
  {
    title: 'LiveID Verification',
    desc: 'Present a face for comparison',
    icon: liveId,
    id: FeatureIdentifier.LiveIDVerification,
  },
  {
    title: 'Login with a QR code',
    desc: 'Approve login from a trusted device',
    icon: qr,
    id: FeatureIdentifier.QRScan,
  },
  {
    title: 'Reset SDK',
    desc: 'Clears all the data',
    icon: sdk,
    id: FeatureIdentifier.Reset,
  },
];

const Separator: React.FC = () => {
  return <View style={styles.separator} />;
};

const FeatureEnrollmentScreen: React.FC<Props> = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);

  const { handler } = route.params;
  const handleFeatureTap = async (id: FeatureIdentifier) => {
    switch (id) {
      case FeatureIdentifier.TOTP:
        navigation.navigate('TOTP');
        break;
      case FeatureIdentifier.NationalID:
        let response = await HomeViewModel.getInstance().scanDocument(
          DocType.nationalId
        );
        if (response != null) {
          setLoading(true);
          let status =
            await HomeViewModel.getInstance().registerNationalIDWithLiveID(
              response
            );
          setLoading(false);
          if (status) {
            Alert.alert('Success', 'registerNationalIDWithLiveID Success');
          } else {
            Alert.alert('Failed', 'registerNationalIDWithLiveID Failed');
          }
        }
        break;
      case FeatureIdentifier.DrivingLicence:
        let res = await HomeViewModel.getInstance().scanDocument(
          DocType.drivingLicence
        );
        if (res != null) {
          setLoading(true);
          let result =
            await HomeViewModel.getInstance().registerDrivingLicenceWithLiveID(
              res
            );
          setLoading(false);
          if (result) {
            Alert.alert('Success', 'registerDrivingLicenceWithLiveID Success');
          } else {
            Alert.alert('Failed', 'registerDrivingLicenceWithLiveID Failed');
          }
        }
        break;
      case FeatureIdentifier.Passport:
        let resp = await HomeViewModel.getInstance().scanDocument(
          DocType.passport
        );
        if (resp != null) {
          setLoading(true);
          let result =
            await HomeViewModel.getInstance().registerPassportWithLiveID(resp);
          setLoading(false);
          if (result) {
            Alert.alert('Success', 'registerPassportWithLiveID Success');
          } else {
            Alert.alert('Failed', 'registerPassportWithLiveID Failed');
          }
        }
        break;
      case FeatureIdentifier.LiveID:
        let isLiveIDRegisterd =
          await HomeViewModel.getInstance().isLiveIDRegisterd();
        if (isLiveIDRegisterd) {
          Alert.alert('Info', 'LiveID is already registered.');
        } else {
          navigation.navigate('LiveID', { isVerification: false });
        }
        break;
      case FeatureIdentifier.LiveIDVerification:
        let isLiveidRegistered =
          await HomeViewModel.getInstance().isLiveIDRegisterd();
        if (isLiveidRegistered) {
          navigation.navigate('LiveID', { isVerification: true });
        } else {
          Alert.alert('Info', 'LiveID is not registered.');
        }
        break;
      case FeatureIdentifier.QRScan:
        navigation.navigate('QRScan');
        break;
      case FeatureIdentifier.Reset:
        await HomeViewModel.getInstance().resetSDK();
        handler(false);
        navigation.goBack();
        break;
      default:
        break;
    }
  };

  const renderItem = ({ item }: { item: Feature }) => {
    return (
      <TouchableOpacity
        onPress={() => handleFeatureTap(item.id)}
        style={styles.itemContainer}
      >
        <>
          <Image source={item.icon} style={styles.icon} />

          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
          <View style={styles.chevronContainer}>
            <Text style={styles.chevron}>{'›'}</Text>
          </View>
        </>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={features}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={Separator}
        renderItem={renderItem}
      />
      {loading ? <SpinnerOverlay visible={loading} /> : <></>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    marginLeft: 13,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  desc: {
    color: 'gray',
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 24,
    color: 'gray',
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgray',
    marginHorizontal: 16,
  },
  icon: {
    width: 30,
    height: 20,

    objectFit: 'contain',
  },
});

export default FeatureEnrollmentScreen;
