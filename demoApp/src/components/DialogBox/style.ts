import {StatusBar, StyleSheet} from 'react-native';
import {Colors} from '../../constants/Colors';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export const styles = StyleSheet.create({
  mainContainer: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 20,
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  warningText: {
    color: Colors.black,
    marginTop: 5,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    width: '100%',
  },
  optionStyle: {
    alignSelf: 'center',
    width: '50%',
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
  },
  lineStyle: {
    borderRightWidth: 1,
    borderColor: 'gray',
    height: 48,
  },
  optionTextStyle: {
    fontSize: 16,
  },
  blurBackground: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    flex: 1,
    justifyContent: 'center',
  },
  textInputStyle: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray,
    borderWidth: 0.3,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
});
