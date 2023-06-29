import {StyleSheet} from 'react-native';
import {Colors} from '../../constants/Colors';

export const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.offWhite,
    width: '70%',
    alignSelf: 'center',
    borderRadius: 20,
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 15,
    color: Colors.black,
  },
  separator: {
    borderBottomWidth: 0.3,
    borderColor: Colors.gray,
    marginTop: 20,
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center',
  },
  optionStyle: {
    alignSelf: 'center',
    width: '50%',
    alignItems: 'center',
    height: 47,
    justifyContent: 'center',
  },
  lineStyle: {
    borderRightWidth: 0.4,
    borderColor: Colors.gray,
    height: 47,
  },
  optionTextStyle: {
    color: '#00ABF0',
    fontWeight: '700',
  },
  blurBackground: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
  },
  setPinText: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 3,
  },
  textInputStyle: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray,
    borderWidth: 0.3,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  textInputStyle1: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderColor: Colors.gray,
    borderWidth: 0.3,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  currentTextInputStyle: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderColor: Colors.gray,
    borderWidth: 0.3,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  errorMessageStyle: {
    alignSelf: 'flex-start',
    marginTop: 5,
    marginLeft: 20,
    color: Colors.red,
  },
});
