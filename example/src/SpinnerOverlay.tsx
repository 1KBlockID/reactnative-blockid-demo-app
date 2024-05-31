import React from 'react';
import { View, ActivityIndicator, Modal, StyleSheet } from 'react-native';

interface SpinnerOverlayProps {
  visible: boolean;
}

const SpinnerOverlay: React.FC<SpinnerOverlayProps> = ({ visible }) => {
  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SpinnerOverlay;
