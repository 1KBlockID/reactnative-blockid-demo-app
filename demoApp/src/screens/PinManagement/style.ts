import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../constants/Colors';

export const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  backArrow: {
    width: 20,
    height: 40,
    marginLeft: 20,
    tintColor:Colors.black,
  },
  headerText: {
    fontSize: 22,
    color: Colors.black,
    marginLeft: 15,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 40,
  },
  buttonTouchable: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
  },
  backArrowContainer:{
    width:50
  }
});
