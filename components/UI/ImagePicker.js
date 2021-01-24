import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert, Modal, TouchableHighlight } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import Colors from '../../constants/Colors';

const ImgPicker = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [pickedImage, setPickedImage] = useState();

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
      Permissions.CAMERA
    );
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant camera permissions to use this app.',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  const takePictureHandler = async () => {
    setModalVisible(!modalVisible);
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.3 
    });

    setPickedImage(image.uri);
    props.onImageTaken(image.uri);
  };

  const getPhotoHandler = async () => {
    setModalVisible(!modalVisible);
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.3 
    });
    setPickedImage(image.uri);
    props.onImageTaken(image.uri);
  };

  const onImageOptionHandler = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.imagePicker}>
      <TouchableHighlight style={styles.imagePreview} onPress={onImageOptionHandler}>
        {!pickedImage ? (
          <Button
            title="Take Picture"
            color={Colors.primary}
            onPress={onImageOptionHandler}
          />
        ) : (
            <Image style={styles.image} source={{ uri: pickedImage }} />
          )}
      </TouchableHighlight>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Please Choose</Text>
            <TouchableHighlight
              style={{ ...styles.openButton }}
              onPress={getPhotoHandler}
            >
              <Text style={styles.textStyle}>From Photos</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton }}
              onPress={takePictureHandler}
            >
              <Text style={styles.textStyle}>Take Picture</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1
  },
  image: {
    width: '100%',
    height: '100%'
  },

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
  openButton: {
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    width: '100%'
  },
  textStyle: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default ImgPicker;
