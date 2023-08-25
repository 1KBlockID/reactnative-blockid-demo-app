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
  logoContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
  },
  loginText: {
    fontSize: 15,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 20,
    color: Colors.black,
    textAlign: 'center',
    width: '70%',
    alignSelf: 'center',
  },
  buttonStyle: {
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
    padding: 10,
    paddingVertical: 15,
  },
  buttonTextStyle: {
    color: Colors.white,
    fontSize: 15,
    alignSelf: 'center',
    fontWeight: '500',
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUSBAR_HEIGHT : 0,
    backgroundColor: Colors.black,
  },
});
