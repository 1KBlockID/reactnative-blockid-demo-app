import React from 'react';
import {SafeAreaView, StatusBar,StatusBarStyle, View} from 'react-native';
import {styles} from './style';

type props = {
  backgroundColor: string;
  barTextColor: StatusBarStyle | null | undefined;
};

export function CustomStatusBar(Props: props): JSX.Element {
  const { backgroundColor, barTextColor } = Props;
  return (
    <View style={[styles.statusBar, { backgroundColor: backgroundColor }]}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <StatusBar barStyle={barTextColor} backgroundColor={backgroundColor} />
      </SafeAreaView>
    </View>
  );
}
