import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import HomeViewModel from './HomeViewModel';
import SpinnerOverlay from './SpinnerOverlay';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from './RootStackParam';

type TenantNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: TenantNavigationProp;
  isRegistered: boolean;
};

const Tenant: React.FC<Props> = ({ navigation, isRegistered }) => {
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
      if (isEnrolled) {
        navigation.navigate('Featurelist');
      }
    } else {
      let isAuthVerified = await viewModel.verifyDeviceAuth();
      console.log('Verify status', isAuthVerified);
      if (isAuthVerified) {
        navigation.navigate('Featurelist');
      }
    }
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
