import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import type { RootStackParamList } from '../RootStackParam';

import { StyleSheet, View, Alert } from 'react-native';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

import HomeViewModel from '../HomeViewModel';
import Tenant from '../Tenant';

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  React.useLayoutEffect(() => {
    const viewModel = HomeViewModel.getInstance();
    setLoading(true);
    viewModel.setLicenseKey().then((result) => {
      if (!result) {
        Alert.alert(
          'Error',
          'Failed to set LicenseKey. Please try again later.'
        );
      }
      setLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      {loading ? <></> : <Tenant navigation={navigation} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default HomeScreen;
