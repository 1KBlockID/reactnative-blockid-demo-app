import React from 'react';
import {View, Alert, Text, TouchableOpacity, Modal} from 'react-native';
import {styles} from './style';

type Props = {
  isModalVisible: boolean;
  handleOkClick: () => void;
  handleCancelClick: () => void;
};

export function DialogBox(props: Props): JSX.Element {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.isModalVisible}
      onRequestClose={props.handleCancelClick}>
      <View style={styles.blurBackground}>
        <View style={styles.mainContainer}>
          <View style={styles.innerContainer}>
            <Text style={styles.warningText}>Warning!</Text>
            <Text style={styles.warningText}>Do you want to reset the app</Text>
          </View>
          <View style={styles.separator}></View>

          <View style={styles.bottomView}>
            <TouchableOpacity
              style={styles.optionStyle}
              onPress={props.handleOkClick}>
              <Text style={styles.optionTextStyle}>OK</Text>
            </TouchableOpacity>

            <View style={styles.lineStyle}></View>
            <TouchableOpacity
              style={styles.optionStyle}
              onPress={props.handleCancelClick}>
              <Text style={styles.optionTextStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
