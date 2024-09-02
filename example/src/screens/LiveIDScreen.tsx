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
  Platform,
} from 'react-native';
import HomeViewModel from '../HomeViewModel';
import { useNavigation, type RouteProp } from '@react-navigation/native';
import SpinnerOverlay from '../SpinnerOverlay';
import { useState } from 'react';
import { ScannerManager, ScannerView, type Layout } from '../ScannerView';
import type { RootStackParamList } from '../RootStackParam';

interface StatusChangeEvent {
  status: string | null;
  error: ErrorResponse | null;
  info: FaceInfo | null;
}

interface ErrorResponse {
  code: number | null;
  description: string | null;
}

interface FaceInfo {
  isFocused: boolean | null;
  message: string | null;
}
const createFragment = (viewId: number | null) =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    UIManager.ScannerManager.Commands.create.toString(),
    [viewId]
  );

const eventEmitter = new NativeEventEmitter(NativeModules.Blockidplugin);

type FeatureEnrollmentScreenRouteProp = RouteProp<RootStackParamList, 'LiveID'>;

type Props = {
  route: FeatureEnrollmentScreenRouteProp;
};

const LiveIDScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [faceState, setFaceState] = useState<FaceInfo | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { isVerification } = route.params;

  const startLiveIDScanning = async () => {
    if (buttonDisabled) return;
    setButtonDisabled(true);
    eventEmitter.removeAllListeners('onStatusChanged');
    eventEmitter.addListener('onStatusChanged', (event: StatusChangeEvent) => {
      if (event.status === 'faceLivenessCheckStarted') {
        setLoading(true);
        setFaceState(null);
      } else if (event.status === 'focusOnFaceChanged') {
        setFaceState(event.info);
      } else if (event.status === 'completed') {
        setLoading(false);
        setFaceState(null);
        Alert.alert(
          'Info',
          isVerification
            ? 'Live ID Verified successfully'
            : 'Live ID Registered successfully',
          [
            {
              text: 'Ok',
              onPress: () => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              },
            },
          ]
        );
      } else if (event.status === 'failed') {
        console.log(event.error);
        setLoading(false);
        setFaceState(null);
        Alert.alert(
          'Info',
          isVerification
            ? (event.error?.description ??
                'Failed to Verify Live ID. Try again!')
            : (event.error?.description ??
                'Failed to register Live ID. Try again!'),
          [
            {
              text: 'Ok',
              onPress: () => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              },
            },
          ]
        );
      }
    });
    const viewModel = HomeViewModel.getInstance();

    isVerification
      ? viewModel.verifyLiveIDScanning()
      : viewModel.enrollLiveIDScanning();
  };

  const ref = React.useRef(null);
  const [layout, setLayout] = React.useState<Layout | null>(null);

  React.useEffect(() => {
    if (Platform.OS === 'android' && layout) {
      const viewId = findNodeHandle(ref.current);
      createFragment(viewId);
    }
  }, [layout]);

  return (
    <View style={styles.container}>
      <View
        style={styles.scannerViewContainer}
        onLayout={(event) => {
          if (Platform.OS === 'android') {
            const { x, y, width, height } = event.nativeEvent.layout;
            setLayout({ x, y, width, height });
          }
        }}
      >
        {layout && Platform.OS === 'android' ? (
          <ScannerManager
            style={{
              height: PixelRatio.getPixelSizeForLayoutSize(layout.height),
              width: PixelRatio.getPixelSizeForLayoutSize(layout.width),
            }}
            ref={ref}
          />
        ) : Platform.OS === 'ios' ? (
          <ScannerView style={styles.scannerView} ref={ref} />
        ) : null}
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
          style={[
            styles.appButtonContainer,
            buttonDisabled && styles.disabledButton,
          ]}
          disabled={buttonDisabled}
        >
          <Text style={styles.appButtonText}>
            {isVerification ? 'Verify LiveID' : 'Start LiveID'}
          </Text>
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
  scannerView: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: 350,
    height: 300,
    resizeMode: 'contain',
    position: 'absolute',
    top: '10%',
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
  disabledButton: {
    backgroundColor: 'gray',
  },
});
export default LiveIDScreen;
