import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Modal,
  TouchableHighlight
} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import Colors from '../../constants/Colors';
import MapPreview from '../place/MapPreview';

const LocationPicker = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [pickedLocation, setPickedLocation] = useState();
  const { onLocationPicked, pickedLocation: ppickedLocation } = props;

  useEffect(() => {
    if (ppickedLocation) {
      setPickedLocation(ppickedLocation);
      onLocationPicked(ppickedLocation);
    }
  }, [ppickedLocation, onLocationPicked]);

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant location permissions to use this app.',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    setModalVisible(!modalVisible);
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      setIsFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000
      });
      const { latitude: lat, longitude: lng } = location.coords;
      setPickedLocation({ lat, lng });
      props.onLocationPicked({ lat, lng });
    } catch (err) {
      Alert.alert(
        'Could not fetch location!',
        'Please try again later or pick a location on the map.',
        [{ text: 'Okay' }]
      );
    }
    setIsFetching(false);
  };

  const pickOnMapHandler = () => {
    setModalVisible(!modalVisible);
    props.navigation.navigate('Map', {
      initialLocation: pickedLocation
    });
  };

  const onMapOptionHandler = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.locationPicker}>
      <MapPreview
        style={styles.mapPreview}
        location={pickedLocation}
        onPress={onMapOptionHandler}
      >
        {isFetching ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
            <Button
              title="Select Location"
              color={Colors.primary}
              onPress={onMapOptionHandler}
            />
          )}
      </MapPreview>
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
              onPress={getLocationHandler}
            >
              <Text style={styles.textStyle}>Auto-Locate</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton }}
              onPress={pickOnMapHandler}
            >
              <Text style={styles.textStyle}>Pick on Map</Text>
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
  locationPicker: {
    marginBottom: 15
  },
  mapPreview: {
    marginBottom: 10,
    width: '100%',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1
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

export default LocationPicker;
