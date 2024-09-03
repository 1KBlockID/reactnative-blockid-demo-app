import * as React from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  findNodeHandle,
  Platform,
  UIManager,
  PixelRatio,
} from 'react-native';
import HomeViewModel from '../HomeViewModel';
import { useState } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../RootStackParam';
import { ScannerManager, ScannerView, type Layout } from '../ScannerView';

type QRScreenNavigationProp = StackNavigationProp<RootStackParamList, 'QRScan'>;
type Props = {
  navigation: QRScreenNavigationProp;
};

const createFragment = (viewId: number | null) =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    UIManager.ScannerManager.Commands.create.toString(),
    [viewId]
  );

const QRScreen: React.FC<Props> = ({ navigation }) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const startQRScan = async () => {
    if (buttonDisabled) return;
    setButtonDisabled(true);
    const viewModel = HomeViewModel.getInstance();
    let authenticationPayloadV1 = await viewModel.startQRScan();
    if (
      authenticationPayloadV1 == null ||
      authenticationPayloadV1 === undefined
    ) {
      Alert.alert('Error', 'Failed to do QR Scan. Please try again later.');
      navigation.goBack();
    } else {
      navigation.navigate('QRAuth', { payload: authenticationPayloadV1 });
    }
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
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={startQRScan}
          style={[
            styles.appButtonContainer,
            buttonDisabled && styles.disabledButton,
          ]}
          disabled={buttonDisabled}
        >
          <Text style={styles.appButtonText}>Start QR Scan</Text>
        </TouchableOpacity>
      </View>
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
  disabledButton: {
    backgroundColor: 'gray',
  },
  scannerViewContainer: {
    width: '100%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default QRScreen;
