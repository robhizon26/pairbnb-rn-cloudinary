import React, { useEffect, useState } from 'react';
import { ScrollView, Image, View, Text, Button, StyleSheet, Modal, TouchableHighlight } from 'react-native';
import { useSelector } from 'react-redux';

import Colors from '../../../../constants/Colors'
import MapPreview from '../../../../components/place/MapPreview';

const PlaceDetail = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const placeId = props.route.params.placeId;
  const { places, bookableplaces } = useSelector(state => state.places);
  const { location: selectedPlace, imageUrl, description } = places.find(place => place.id === placeId);
  const selectedLocation = { lat: selectedPlace.lat, lng: selectedPlace.lng };
  const [isBookable, setIsBookable] = useState(false);

  useEffect(() => {
    setIsBookable(bookableplaces.some(place => place.id === placeId))
  }, [setIsBookable]);

  const showMapHandler = () => {
    props.navigation.navigate('Map', {
      readonly: true,
      initialLocation: selectedLocation
    });
  };

  const openCreateBooking = mode => {
    setModalVisible(!modalVisible);
    props.navigation.navigate('CreateBooking', {
      selectedMode: mode,
      selectedPlace: places.find(place => place.id === placeId)
    });
  }

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.subtitleContainer}>
        <Text style={styles.address}>{description}</Text>
      </View>
      <View style={styles.locationContainer}>
        <View style={styles.subtitleContainer}>
          <Text style={styles.address}>{selectedPlace.address}</Text>
        </View>
        <MapPreview
          style={styles.mapPreview}
          location={selectedLocation}
          onPress={showMapHandler}
        />
      </View>
      {isBookable &&
        <View style={styles.button}>
          <Button
            title="Book"
            color={Colors.primary}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          />
        </View>
      }
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Choose an Action</Text>
            <TouchableHighlight
              style={{ ...styles.openButton }}
              onPress={() => {
                openCreateBooking('select');
              }}
            >
              <Text style={styles.textStyle}>Select Date</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton }}
              onPress={() => {
                openCreateBooking('random');
              }}
            >
              <Text style={styles.textStyle}>Random Date</Text>
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
    </ScrollView>
  );
}

export const screenOptions = navData => {
  return {
    headerTitle: navData.route.params.placeTitle
  };
};

const styles = StyleSheet.create({
  image: {
    height: '35%',
    minHeight: 300,
    width: '100%',
    backgroundColor: '#ccc'
  },
  locationContainer: {
    marginVertical: 10,
    width: '90%',
    maxWidth: 350,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 10
  },
  subtitleContainer: {
    padding: 20
  },
  button: {
    padding: 20,
    width: 130
  },
  address: {
    textAlign: 'center'
  },
  mapPreview: {
    width: '100%',
    maxWidth: 350,
    height: 300,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
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

export default PlaceDetail;