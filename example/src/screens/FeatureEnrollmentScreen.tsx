import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import type { RootStackParamList } from '../RootStackParam';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

type FeatureEnrollmentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Featurelist'
>;
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
}

interface Feature {
  title: string;
  desc: string;
  id: FeatureIdentifier;
}

const features: Feature[] = [
  {
    title: 'TOTP',
    desc: 'Get TOTP each valid for 30sec',
    id: FeatureIdentifier.TOTP,
  },
  {
    title: 'National ID enroll',
    desc: 'Enroll your ID',
    id: FeatureIdentifier.NationalID,
  },
  {
    title: 'Driving Licence enroll',
    desc: 'Enroll your Driving Licence',
    id: FeatureIdentifier.DrivingLicence,
  },
  {
    title: 'Passport enroll',
    desc: 'Enroll your Passport',
    id: FeatureIdentifier.Passport,
  },
  {
    title: 'LiveID',
    desc: 'Live ID Face verification',
    id: FeatureIdentifier.LiveID,
  },
  {
    title: 'QR Scan',
    desc: 'QR Scan Auth with scopes',
    id: FeatureIdentifier.QRScan,
  },
  {
    title: 'Reset SDK',
    desc: 'Clears all the data',
    id: FeatureIdentifier.Reset,
  },
];

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Separator: React.FC = () => {
  return <View style={styles.separator} />;
};

const FeatureEnrollmentScreen: React.FC<Props> = ({ navigation }) => {
  const handleFeatureTap = (id: FeatureIdentifier) => {
    switch (id) {
      case FeatureIdentifier.TOTP:
        navigation.navigate('TOTP');
        break;
      case FeatureIdentifier.NationalID:
        // Handle National ID enrollment
        break;
      case FeatureIdentifier.DrivingLicence:
        // Handle Driving Licence enrollment
        break;
      case FeatureIdentifier.Passport:
        // Handle Passport enrollment
        break;
      case FeatureIdentifier.LiveID:
        // Handle Live ID Face verification
        break;
      case FeatureIdentifier.QRScan:
        // Handle QR Scan Auth
        break;
      case FeatureIdentifier.Reset:
        // Handle SDK reset
        break;
      default:
        break;
    }
  };

  const renderItem = ({ item }: { item: Feature }) => {
    const color = getRandomColor();
    const initials =
      item.title.length > 1
        ? item.title.substring(0, 2).toUpperCase()
        : item.title;

    return (
      <TouchableOpacity
        onPress={() => handleFeatureTap(item.id)}
        style={styles.itemContainer}
      >
        <View style={[styles.avatar, { backgroundColor: color }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
        </View>
        <View style={styles.chevronContainer}>
          <Text style={styles.chevron}>{'›'}</Text>
        </View>
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default FeatureEnrollmentScreen;
