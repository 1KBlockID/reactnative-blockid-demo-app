import {Platform, StatusBar, StyleSheet} from 'react-native';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUSBAR_HEIGHT : 0,
  },
});
