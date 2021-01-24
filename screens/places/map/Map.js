import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Platform
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../../components/UI/HeaderButton';
import Colors from '../../../constants/Colors';

const Map = props => {
  const initialLocation = props.route.params ? props.route.params.initialLocation : null;
  const readonly = props.route.params ? props.route.params.readonly : false;
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : 37.78,
    longitude: initialLocation ? initialLocation.lng : -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  const selectLocationHandler = event => {
    if (readonly) {
      return;
    }
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;
    setSelectedLocation({ lat, lng });
  };

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      // could show an alert!
      return;
    }
    props.navigation.navigate('NewOffer', { pickedLocation: selectedLocation });
  }, [selectedLocation]);

  useEffect(() => {
    props.navigation.setParams({ saveLocation: savePickedLocationHandler });
  }, [savePickedLocationHandler]);

  let markerCoordinates;

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng
    };
  }
  return (
    <MapView
      style={styles.map}
      initialRegion={mapRegion}
      onLongPress={selectLocationHandler}
      onPress={selectLocationHandler}
    >
      {markerCoordinates && (
        <Marker title="Picked Location" coordinate={markerCoordinates} />
      )}
    </MapView>
  );
};

export const screenOptions = navData => {
  const saveFn = navData.route.params ? navData.route.params.saveLocation : null;
  const readonly = navData.route.params ? navData.route.params.readonly : false;
  if (readonly) {
    return {};
  }
  return {
    headerTitle: 'Map',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={saveFn}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  } 
});

export default Map;
