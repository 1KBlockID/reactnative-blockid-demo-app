import React, { useState } from 'react';

import { StyleSheet, View, Alert } from 'react-native';
import SpinnerOverlay from './SpinnerOverlay';

import HomeViewModel from './HomeViewModel';
import Tenant from './Tenant';

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
});
