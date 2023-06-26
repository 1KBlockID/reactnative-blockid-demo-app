import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../constants/Colors';

export const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mainContainer: {
    flex: 1,
  },
  backArrow: {
    width: 15,
    height: 35,
    marginLeft: 20,
    tintColor: 'black',
  },
  logoContainer: {
    width: 100,
    alignItems: 'flex-start',
  },
  buttonContainer: {
    padding: 15,
    backgroundColor: 'black',
    marginBottom: 15,
  },
  buttonTextStyle: {
    textAlign: 'center',
    color: 'white',
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0.2,
  },
  bottomView: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  textInputStyle: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 10,
  },
  loaderContainer: {
    zIndex: 10,
    position: 'absolute',
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorContainer: {
    backgroundColor: '#FDFEFF',
    alignSelf: 'center',
    width: 130,
    height: 80,
    justifyContent: 'center',
    borderRadius: 10,
  },
  touchableContainer: {
    width: '45%',
    backgroundColor: 'black',
    padding: 15,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
  },
});
