import * as React from 'react';

import {
  StyleSheet,
  View,
  NativeEventEmitter,
  NativeModules,
  TouchableOpacity,
  Text,
  Alert,
  Image,
} from 'react-native';
import HomeViewModel from '../HomeViewModel';
import { useNavigation } from '@react-navigation/native';
import SpinnerOverlay from '../SpinnerOverlay';
import { useState } from 'react';
import { ScannerView } from '../ScannerView';

const eventEmitter = new NativeEventEmitter(NativeModules.Blockidplugin);

interface StatusChangeEvent {
  status: string | null;
  error: Error | null;
  info: FaceInfo | null;
}
interface FaceInfo {
  isFocused: boolean | null;
  message: string | null;
}

export default function LiveIDScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [faceState, setFaceState] = useState<FaceInfo | null>(null);

  const startLiveIDScanning = async () => {
    eventEmitter.addListener('onStatusChanged', (event: StatusChangeEvent) => {
      console.log('onStatusChanged', event);
      if (event.status === 'faceLivenessCheckStarted') {
        setLoading(true);
        setFaceState(null);
      } else if (event.status === 'focusOnFaceChanged') {
        //  Alert.alert('Info', 'Face focusOnFaceChanged');
        setFaceState(event.info);
      } else if (event.status === 'completed') {
        setLoading(false);
        setFaceState(null);
        Alert.alert('Info', 'Live ID Registered successfully');
        navigation.goBack();
      } else if (event.status === 'failed') {
        setLoading(false);
        setFaceState(null);
        Alert.alert('Info', 'Failed to register Live ID try again!');
        navigation.goBack();
      }
    });
    const viewModel = HomeViewModel.getInstance();
    viewModel.startLiveIDScanning();
  };

  return (
    <View style={styles.container}>
      <View style={styles.scannerViewContainer}>
        <ScannerView style={styles.scannerView} />
        <Image source={require('../../assets/live.png')} style={styles.image} />
      </View>
      {faceState?.isFocused === false &&
        (faceState?.message ?? '').length > 0 && (
          <View style={styles.overlay}>
            <Text>{faceState?.message}</Text>
          </View>
        )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={startLiveIDScanning}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>Start LiveID Scan</Text>
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
  scannerView: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: 360,
    height: 320,
    resizeMode: 'contain',
    position: 'absolute',
    top: '10%',
  },
  scannerViewContainer: {
    backgroundColor: 'gray',
    width: '100%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    backgroundColor: 'gray',
    padding: 16,
    alignItems: 'center',
  },
});
