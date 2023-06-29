import React from 'react';
import {View, Text, TouchableOpacity, Modal, TextInput} from 'react-native';
import {styles} from './style';
import {Strings} from '../../constants/Strings';
import {Colors} from '../../constants/Colors';

type Props = {
  isModalVisible: boolean;
  isResetFido: boolean;
  handleDoneClick: () => void;
  handleCancelClick: () => void;
  isChangePin: boolean;
  setCurrentPin?: (value: string) => void;
  setPin?: (value: string) => void;
  setConfirmPin?: (value: string) => void;
  pin: string;
  confirmPin: string;
  currentPin: string;
  errorMsg?:string
};

export function PinModal(props: Props): JSX.Element {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.isModalVisible}
      onRequestClose={props.handleCancelClick}>
      <View style={styles.blurBackground}>
        <View
          style={[
            styles.mainContainer,
            {top: props.isResetFido ? '45%' : '25%'},
          ]}>
          <View style={styles.innerContainer}>
            <Text
              style={[
                styles.setPinText,
                {marginBottom: props.isResetFido ? 5 : 0},
              ]}>
              {props.isChangePin
                ? Strings.ChangePIN
                : props.isResetFido
                ? Strings.CancellationWarning
                : Strings.SetPIN}
            </Text>
            <Text
              style={[
                styles.warningText,
                {
                  marginTop: props.isResetFido ? 0 : 0,
                  marginBottom: props.isResetFido ? 0 : 18,
                },
              ]}>
              {props.isChangePin
                ? Strings.EnterTheKeyPIN
                : props.isResetFido
                ? Strings.ResetFidoText
                : Strings.EnterTheNewPIN}
            </Text>
          </View>
          {!props.isResetFido && (
            <>
              {props.isChangePin && (
                <TextInput
                  style={styles.currentTextInputStyle}
                  placeholder={Strings.currentPIN}
                  onChangeText={value => {
                    props.setCurrentPin?.(value);
                  }}
                  value={props.currentPin}
                  keyboardType="number-pad"
                />
              )}

              <TextInput
                style={[
                  styles.textInputStyle,
                  {
                    borderTopLeftRadius: props.isChangePin ? 0 : 18,
                    borderTopRightRadius: props.isChangePin ? 0 : 18,
                  },
                ]}
                placeholder={Strings.NewPIN}
                onChangeText={value => {
                  props.setPin?.(value);
                }}
                value={props.pin}
                keyboardType="number-pad"
              />
              <TextInput
                style={styles.textInputStyle1}
                placeholder={Strings.ConfirmPIN}
                onChangeText={value => {
                  props.setConfirmPin?.(value);
                }}
                value={props.confirmPin}
                keyboardType="number-pad"
              />
            </>
          )}
          <Text style={styles.errorMessageStyle}>{props.errorMsg}</Text>
          <View style={styles.separator}></View>
          <View style={styles.bottomView}>
            <TouchableOpacity
              style={styles.optionStyle}
              onPress={props.handleCancelClick}>
              <Text style={styles.optionTextStyle}>
                {props.isResetFido ? Strings.NO : Strings.Cancel}
              </Text>
            </TouchableOpacity>

            <View style={styles.lineStyle}></View>
            <TouchableOpacity
              style={styles.optionStyle}
              onPress={props.handleDoneClick}>
              <Text
                style={[
                  styles.optionTextStyle,
                  {color: props.isResetFido ? Colors.peach : Colors.SkyBlue},
                ]}>
                {props.isResetFido ? Strings.Yes : Strings.Done}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
