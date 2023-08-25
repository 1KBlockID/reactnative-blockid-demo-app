import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import {styles} from './style';
import {Strings} from '../../constants/Strings';
import {Colors} from '../../constants/Colors';

type Props = {
  isModalVisible: boolean;
  handleOkClick: () => void;
  handleCancelClick: () => void;
  isPinRequired?: boolean;
  pin?: string;
  setPin?: (value: string) => void;
};

export function DialogBox(props: Props): JSX.Element {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.isModalVisible}
      onRequestClose={props.handleCancelClick}>
      <View
        style={[
          styles.blurBackground,
          ,
          {
            backgroundColor: props.isPinRequired
              ? 'rgba(0,0,0,0.3)'
              : 'rgba(0,0,0,0.8)',
          },
        ]}>
        <View
          style={[
            styles.mainContainer,
            {
              backgroundColor: props.isPinRequired
                ? Colors.offWhite
                : Colors.white,
            },
          ]}>
          <View style={styles.innerContainer}>
            <Text style={[styles.warningText, {fontSize:props.isPinRequired?16:14,fontWeight:props.isPinRequired?'600':'400'}]}>
              {props.isPinRequired
                ? Strings.PINVerificationRequired
                : Strings.Warning}
            </Text>
            <Text style={styles.warningText}>
              {props.isPinRequired
                ? Strings.EnterTheKeyPIN
                : Strings.resetAppText}
            </Text>
          </View>
          {props.isPinRequired && (
            <TextInput
              style={[styles.textInputStyle]}
              placeholder={Strings.PIN}
              onChangeText={value => {
                props.setPin?.(value);
              }}
              value={props.pin}
              keyboardType="number-pad"
            />
          )}
          <View style={styles.separator}></View>
          <View style={styles.bottomView}>
            <TouchableOpacity
              style={styles.optionStyle}
              onPress={props.handleOkClick}>
              <Text
                style={[
                  styles.optionTextStyle,
                  {
                    color: props.isPinRequired ? Colors.SkyBlue : Colors.black,
                    fontWeight: props.isPinRequired ? '600' : '400',
                  },
                ]}>
                {props.isPinRequired ? Strings.Cancel : Strings.Ok}
              </Text>
            </TouchableOpacity>

            <View style={styles.lineStyle}></View>
            <TouchableOpacity
              style={styles.optionStyle}
              onPress={props.handleCancelClick}>
              <Text
                style={[
                  styles.optionTextStyle,
                  {
                    color: props.isPinRequired ? Colors.SkyBlue : Colors.black,
                    fontWeight: props.isPinRequired ? '600' : '400',
                  },
                ]}>
                {props.isPinRequired ? Strings.Verify : Strings.Cancel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
