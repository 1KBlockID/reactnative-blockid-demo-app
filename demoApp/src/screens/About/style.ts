import {StyleSheet} from 'react-native';
import {Colors} from '../../constants/Colors';

export const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
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
    width: 15,
    height: 35,
    marginLeft: 20,
    tintColor: 'black',
  },
  headerText: {
    fontSize: 24,
    color: Colors.black,
    marginLeft: 15,
    fontWeight: '500',
  },
  textStyle: {
    fontSize: 15,
    color: 'black',
    marginTop: 10,
    padding: 20,
    fontWeight: '400',
    textAlign:'left'
  },
  copyContainer: {
    alignSelf: 'center',
    backgroundColor: Colors.black,
    paddingHorizontal: 38,
    paddingVertical: 8,
    position: 'absolute',
    bottom: 30,
  },
  copyText: {
    color: Colors.white,
    padding: 5,
    fontWeight: '500',
    fontSize: 14,
  },
});
