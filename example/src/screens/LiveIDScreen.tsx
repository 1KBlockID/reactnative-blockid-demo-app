import * as React from 'react';

import {
  StyleSheet,
  View,
  NativeEventEmitter,
  NativeModules,
  TouchableOpacity,
  Text,
  type StyleProp,
  type ViewStyle,
  Alert,
} from 'react-native';
import { requireNativeComponent } from 'react-native';
import HomeViewModel from '../HomeViewModel';
import { useNavigation } from '@react-navigation/native';
import SpinnerOverlay from '../SpinnerOverlay';
import { useState } from 'react';

const eventEmitter = new NativeEventEmitter(NativeModules.Blockidplugin);

interface StatusChangeEvent {
  status: string | null;
  error: Error | null;
}

interface ScannerViewProps {
  style?: StyleProp<ViewStyle>; // Make sure to import StyleProp and ViewStyle from 'react-native'
}

const ScannerView = requireNativeComponent<ScannerViewProps>('RNTScannerView');

export default function LiveIDScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const startLiveIDScanning = async () => {
    eventEmitter.addListener('onStatusChanged', (event: StatusChangeEvent) => {
      console.log('onStatusChanged', event);
      if (event.status === 'faceLivenessCheckStarted') {
        setLoading(true);
      } else if (event.status === 'focusOnFaceChanged') {
        //  Alert.alert('Info', 'Face focusOnFaceChanged');
      } else if (event.status === 'completed') {
        setLoading(false);
        Alert.alert('Info', 'Live ID Registered successfully');
        navigation.goBack();
      } else if (event.status === 'failed') {
        setLoading(false);
        Alert.alert('Info', 'Failed to register Live ID try again!');
        navigation.goBack();
      }
    });
    const viewModel = HomeViewModel.getInstance();
    viewModel.startLiveIDScanning();
  };

  return (
    <View style={styles.container}>
      <ScannerView style={styles.scannerView} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={startLiveIDScanning}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>LiveID Scanning</Text>
        </TouchableOpacity>
      </View>
      <SpinnerOverlay visible={loading} />
    </View>
  );
}

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
