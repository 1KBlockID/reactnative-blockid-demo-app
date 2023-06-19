import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {Colors} from '../../constants/Colors';
import {styles} from './style';

export function CustomStatusBar(): JSX.Element {
  return (
    <View style={[styles.statusBar]}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <StatusBar barStyle={'light-content'} backgroundColor={Colors.black} />
      </SafeAreaView>
    </View>
  );
}
