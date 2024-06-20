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
  PixelRatio,
  UIManager,
  findNodeHandle,
} from 'react-native';
import HomeViewModel from '../HomeViewModel';
import { useNavigation } from '@react-navigation/native';
import SpinnerOverlay from '../SpinnerOverlay';
import { useState } from 'react';
import { ScannerRefViewManager } from '../ScannerView';

interface StatusChangeEvent {
  status: string | null;
  error: Error | null;
  info: FaceInfo | null;
}
interface FaceInfo {
  isFocused: boolean | null;
  message: string | null;
}
const createFragment = (viewId: number | null) =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    // we are calling the 'create' command
    UIManager.ScannerRefViewManager.Commands.create.toString(),
    [viewId]
  );

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};
const eventEmitter = new NativeEventEmitter(NativeModules.Blockidplugin);

export default function LiveIDScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [faceState, setFaceState] = useState<FaceInfo | null>(null);
  const startLiveIDScanning = async () => {
    eventEmitter.addListener('onStatusChanged', (event: StatusChangeEvent) => {
      if (event.status === 'faceLivenessCheckStarted') {
        setLoading(true);
        setFaceState(null);
      } else if (event.status === 'focusOnFaceChanged') {
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

  const ref = React.useRef(null);
  const [layout, setLayout] = React.useState<Layout | null>(null);

  React.useEffect(() => {
    if (layout) {
      const viewId = findNodeHandle(ref.current);
      createFragment(viewId);
    }
  }, [layout]);

  return (
    <View style={styles.container}>
      <View
        style={styles.scannerViewContainer}
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setLayout({ x, y, width, height });
        }}
      >
        {layout && (
          <ScannerRefViewManager
            style={{
              height: PixelRatio.getPixelSizeForLayoutSize(layout.height),
              width: PixelRatio.getPixelSizeForLayoutSize(layout.width),
            }}
            ref={ref}
          />
        )}
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
    width: 350,
    height: 300,
    resizeMode: 'contain',
    position: 'absolute',
    top: '20%',
  },
  scannerViewContainer: {
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
