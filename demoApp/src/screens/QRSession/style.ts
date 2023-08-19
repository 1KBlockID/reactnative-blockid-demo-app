import {Platform, StatusBar, StyleSheet} from 'react-native';
import {Colors} from '../../constants/Colors';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUSBAR_HEIGHT : 0,
    backgroundColor: Colors.black,
  },
  btnContainer: {
    backgroundColor: 'black',
    padding: 20,
    width: '80%',
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  btnTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});
