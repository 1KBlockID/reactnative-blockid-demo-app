import {StatusBar, StyleSheet} from 'react-native';
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
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 80,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: Colors.black,
  },
  buttonStyle: {
    width: '96%',
    padding: 20,
    marginBottom: 2,
    alignSelf: 'center',
    borderBottomWidth: 0.3,
    borderColor: Colors.gray,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.black,
  },
  tickImageStyle:{
    height: 30, width: 30
  }
});
