import * as React from 'react';

import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import HomeViewModel from '../HomeViewModel';
import SpinnerOverlay from '../SpinnerOverlay';
import { useState } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../RootStackParam';
import { ScannerView } from '../ScannerView';

type QRScreenNavigationProp = StackNavigationProp<RootStackParamList, 'QRScan'>;
type Props = {
  navigation: QRScreenNavigationProp;
};
const QRScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const startLiveIDScanning = async () => {
    const viewModel = HomeViewModel.getInstance();
    setLoading(true);
    let authenticationPayloadV1 = await viewModel.startQRScan();
    setLoading(false);
    if (
      authenticationPayloadV1 == null ||
      authenticationPayloadV1 === undefined
    ) {
      Alert.alert('Error', 'Failed to do QR Scan. Please try again later.');
    } else {
      navigation.navigate('QRAuth', { payload: authenticationPayloadV1 });
    }
  };

  return (
    <View style={styles.container}>
      <ScannerView style={styles.scannerView} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={startLiveIDScanning}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>Start QR Scan</Text>
        </TouchableOpacity>
      </View>
      <SpinnerOverlay visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  scannerView: {
    width: 350,
    height: 400,
    // backgroundColor: 'green',
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
  appButtonContainer: {
    elevation: 8,
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    height: 48,
  },
});

export default QRScreen;
