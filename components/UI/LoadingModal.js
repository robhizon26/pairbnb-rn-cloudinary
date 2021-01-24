import React, { useState } from 'react';
import { View, ActivityIndicator, Image, Text, StyleSheet, Alert, Modal } from 'react-native';
import Colors from '../../constants/Colors';

const LoadingModal = props => {
  const { message, isVisible } = props;

  return (
    <Modal
      transparent={true}
      visible={isVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{message}</Text>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '60%'
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  }
});

export default LoadingModal;
