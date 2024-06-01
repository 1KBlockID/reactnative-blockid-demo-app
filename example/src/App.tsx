import React, { useState } from 'react';

import {
  StyleSheet,
  View,
  Alert,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import SpinnerOverlay from './SpinnerOverlay';

import HomeViewModel from './HomeViewModel';
import Tenant from './Tenant';

import { requireNativeComponent } from 'react-native';

interface MyCustomViewProps {
  style?: StyleProp<ViewStyle>; // Make sure to import StyleProp and ViewStyle from 'react-native'
}

const ScannerView1 =
  requireNativeComponent<MyCustomViewProps>('RNTScannerView11');

export default function App() {
  const [loading, setLoading] = useState(false);
  const [isBlockIDSdkReady, setisBlockIDSdkReady] = useState(false);

  React.useLayoutEffect(() => {
    const viewModel = HomeViewModel.getInstance();
    setLoading(true);
    viewModel.setLicenseKey().then((result) => {
      if (!result) {
        Alert.alert(
          'Error',
          'Failed to set LicenseKey. Please try again later.'
        );
      } else {
        viewModel.isSDKReady().then((res) => {
          setisBlockIDSdkReady(res);
          console.log('setisBlockIDSdkReady', res);
        });
      }
      setLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      {!loading && <ScannerView1 style={styles.scannerView} />}
      {loading ? (
        <SpinnerOverlay visible={loading} />
      ) : (
        <Tenant isRegistered={isBlockIDSdkReady} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  scannerView: {
    width: 200,
    height: 200,
    // backgroundColor: 'green',
  },
});
