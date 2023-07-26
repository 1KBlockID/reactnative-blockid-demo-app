import {StyleSheet} from 'react-native';
import {Colors} from '../../constants/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  authenticateButton: {
    backgroundColor: Colors.black,
    padding: 17,
    bottom: 30,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authenticateText: {
    color: Colors.white,
  },
  listText: {
    padding: 20,
    backgroundColor: 'white',
  },
});
