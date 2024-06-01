import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import HomeViewModel from './HomeViewModel';
import SpinnerOverlay from './SpinnerOverlay';

interface TenantProps {
  isRegistered: boolean;
}

const Tenant: React.FC<TenantProps> = ({ isRegistered }) => {
  const [loading, setLoading] = useState(false);

  const handleRegisterTenant = () => {
    const viewModel = HomeViewModel.getInstance();
    setLoading(true);
    viewModel.initiateTempWallet().then((result) => {
      if (result) {
        viewModel.registerTenant().then((success) => {
          isRegistered = success;
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  };

  const handleFeatureEnrollment = async () => {
    const viewModel = HomeViewModel.getInstance();
    let isDeviceAuthRegisterd = await viewModel.isDeviceAuthRegisterd();
    if (!isDeviceAuthRegisterd) {
      let isEnrolled = await viewModel.enrollDeviceAuth();
      console.log('Enroll status', isEnrolled);
    } else {
      let isAuthVerified = await viewModel.verifyDeviceAuth();
      console.log('Verify status', isAuthVerified);
      let totp = await viewModel.totp();
      console.log('TOTP', totp?.totp, totp?.getRemainingSecs);
    }
  };

  const startLiveIDScanning = async () => {
    const viewModel = HomeViewModel.getInstance();
    viewModel.startLiveIDScanning();
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={isRegistered ? undefined : handleRegisterTenant}
        disabled={isRegistered}
        style={[
          styles.appButtonContainer,
          isRegistered && styles.disabledButton,
        ]}
      >
        <Text style={styles.appButtonText}>
          {isRegistered ? 'Tenant Registered' : 'Register Default Tenant'}
        </Text>
      </TouchableOpacity>
      <View style={styles.spacing} />
      {isRegistered ? (
        <TouchableOpacity
          onPress={handleFeatureEnrollment}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>Go to Feature Enrollment</Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity
        onPress={startLiveIDScanning}
        style={styles.appButtonContainer}
      >
        <Text style={styles.appButtonText}>LiveID Scanning</Text>
      </TouchableOpacity>
      <SpinnerOverlay visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Tenant;
