import React from 'react';
import {ActivityIndicator} from 'react-native';
import {styles} from './style';
import {Colors} from '../../constants/Colors';

export const Loader = (): React.ReactElement => {
  return (
    <ActivityIndicator
      size={'large'}
      color={Colors.black}
      style={styles.loaderContainer}
    />
  );
};
