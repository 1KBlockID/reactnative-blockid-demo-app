import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../constants/Colors';

export const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  logoContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 100,
  },
  bottomContainer: {
    flex: 0.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 25,
  },
  buttonContainerStyle: {
    width: '75%',
    backgroundColor: Colors.black,
    padding: 14,
    marginBottom: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: '500',
  },
  indicatorOuterContainer: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: 5,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
  },
  indicatorContainer: {
    backgroundColor: '#FDFEFF',
    alignSelf: 'center',
    width: 180,
    height: 100,
    justifyContent: 'center',
    borderRadius: 10,
  },
  indicatorStyle: {},
  loaderText: {
    alignSelf: 'center',
    color: Colors.black,
    fontSize: 12,
    marginTop: 10,
  },
});
