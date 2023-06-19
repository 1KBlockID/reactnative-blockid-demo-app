import {StatusBar, StyleSheet} from 'react-native';
import {Colors} from '../../constants/Colors';


const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export const styles = StyleSheet.create({
   mainContainer:{
    backgroundColor: 'white',
    width: '70%',
    alignSelf: 'center',
    borderRadius: 20,
   },
   innerContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
   },
   warningText:{
    fontSize: 14, color: 'black', marginTop: 5
   },
   separator:{
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
   },
   bottomView:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 40,
    alignContent: 'center',
   },
   optionStyle:{
    alignSelf: 'center'
   },
   lineStyle:{
    borderRightWidth: 1,
    borderColor: 'gray',
    height: 40,
   },
   optionTextStyle:{
    color:Colors.black
   },
   blurBackground:{
      backgroundColor: 'rgba(0,0,0,0.8)',
      flex: 1,
      justifyContent:'center'
   }
});
