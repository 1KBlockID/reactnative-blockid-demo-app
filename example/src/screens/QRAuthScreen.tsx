import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import HomeViewModel from '../HomeViewModel';
import SpinnerOverlay from '../SpinnerOverlay';
import type { RootStackParamList } from '../RootStackParam';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type FeatureEnrollmentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'QRAuth'
>;
type FeatureEnrollmentScreenRouteProp = RouteProp<RootStackParamList, 'QRAuth'>;

type Props = {
  navigation: FeatureEnrollmentScreenNavigationProp;
  route: FeatureEnrollmentScreenRouteProp;
};

const QRAuthScreen: React.FC<Props> = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState('');

  React.useEffect(() => {
    const viewModel = HomeViewModel.getInstance();
    const { payload } = route.params;
    viewModel.getScopesAttributesDic(payload.getMap()).then((result) => {
      setLoading(false);
      setData(result);
    });
  }, [route.params]);

  const authenticateUserWithScopes = () => {
    const viewModel = HomeViewModel.getInstance();
    setLoading(true);
    const { payload } = route.params;
    viewModel.authenticateUserWithScopes(payload.getMap()).then((result) => {
      setLoading(false);
      if (result) {
        Alert.alert('Success', 'BlockID ->>> QR Scan Auth Successfully');
      } else {
        Alert.alert('Error', 'BlockID ->>> QR Scan Auth Failed');
      }
      navigation.goBack();
      navigation.goBack();
    });
  };

  return (
    <View style={styles.container}>
      <SpinnerOverlay visible={loading} />
      <View style={styles.content}>
        <Text style={styles.text}>{data}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={authenticateUserWithScopes}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>Authenticate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: 'black',
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    left: 30,
    right: 30,
    bottom: 30,
  },
  disabledButton: {
    opacity: 0.5, // Adjust opacity for disabled button
  },
  spacing: {
    height: 30,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QRAuthScreen;
