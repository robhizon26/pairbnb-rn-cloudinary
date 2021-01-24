import React, { useCallback, useEffect, useState, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../../../components/UI/HeaderButton';
import Input from '../../../../components/UI/Input';
import DateInput from '../../../../components/UI/DateInput';
import ImagePicker from '../../../../components/UI/ImagePicker';
import LocationPicker from '../../../../components/UI/LocationPicker';
import LoadingModal from '../../../../components/UI/LoadingModal';
import * as placesActions from '../../../../store/actions/places';
import Place from '../../../../models/place';
import { getAddress } from '../../../../store/actions/places';
import { PlaceLocation } from '../../../../models/location';
import Config from '../../../../constants/config'; 

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};


export default NewOffer = props => {
  const [isCreatingPlace, setIsCreatingPlace] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const dispatch = useDispatch();
  const { token, userId } = useSelector(state => state.auth);

  const [dates, setDates] = useState({});
  const [selectedImage, setSelectedImage] = useState();
  const [selectedLocation, setSelectedLocation] = useState();

  const pickedLocation = props.route.params ? props.route.params.pickedLocation : null;
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: '',
      description: '',
      price: '',
    },
    inputValidities: {
      title: false,
      description: false,
      price: false,
    },
    formIsValid: false
  });

  const isEntryValid = () => {
    if (!formState.formIsValid) return false;
    if (!dates?.availableFrom) return false;
    if (!dates?.availableTo) return false;
    if (dates?.availableFrom > dates?.availableTo) return false;
    if (+formState.inputValues.price <= 0) return false;
    if (!selectedImage) return false;
    if (!selectedLocation) return false;
    return true;
  }

  const onCreateOffer = async () => {
    if (!isEntryValid()) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [{ text: 'Okay' }]);
      return;
    }
    try {
      const { lat, lng } = selectedLocation;
      let addressData = await getAddress(lat, lng);
      const { address, error: erradd } = addressData;
      if (erradd) {
        Alert.alert('Could not fetch location address!', 'Please try again later or pick a location on the map.', [{ text: 'Okay' }]);
        return;
      }
      const pickedLocation = new PlaceLocation(lat, lng, address, getMapImage(lat, lng, 14));
      setIsUploadingImage(true);
      let imageData = await placesActions.cloudinaryUpload(selectedImage);
      const { imageRes, error: errimg } = imageData;
      setIsUploadingImage(false);
      if (imageRes && address) {
        setIsCreatingPlace(true);
        const place = new Place(
          null,
          formState.inputValues.title,
          formState.inputValues.description,
          imageRes.secure_url,
          +formState.inputValues.price,
          dates.availableFrom,
          dates.availableTo,
          userId,
          pickedLocation
        )
        let placeData = await placesActions.addPlace(place, token)
        const { response, error: errpla } = placeData;
        setIsCreatingPlace(false);
        if (response) {
          await dispatch(placesActions.fetchPlaces());
          props.navigation.goBack();
        }
        if (errpla) {
          Alert.alert('An Error Occurred!', 'Could not create place.', [{ text: 'Okay' }]);
        }
      }
      if (errimg) {
        Alert.alert('An Error Occurred!', 'Could not upload image.', [{ text: 'Okay' }]);
      }
    } catch (err) {
      setIsUploadingImage(false);
      setIsCreatingPlace(false);
      Alert.alert('An Error Occurred!', 'Could not create place.', [{ text: 'Okay' }]);
    }
  }

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Save"
            iconName={
              Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
            }
            onPress={onCreateOffer}
          />
        </HeaderButtons>
      )
    });
  }, [onCreateOffer]);

  const getMapImage = (lat, lng, zoom) => {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${Config.googleMapsAPIKey}`;
  }

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    }, [dispatchFormState]);

  const imageTakenHandler = imageUri => {
    setSelectedImage(imageUri);
  };

  const locationPickedHandler = useCallback(location => {
    setSelectedLocation(location);
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}  >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            errorText="Please enter a valid title!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue=''
            minLength={5}
            required
          />
          <Input
            id="description"
            label="Short Description"
            errorText="Please enter a valid description!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue=''
            required
            minLength={5}
          />
          <Input
            id="price"
            label="Price"
            errorText="Please enter a valid price!"
            keyboardType="decimal-pad"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            required
            min={0.1}
          />
          <View style={styles.datesInputContainer}>
            <View style={styles.dateForm} >
              <DateInput value={dates.availableFrom} label="Available from"
                onSetValue={newdate => {
                  setDates({ ...dates, availableFrom: newdate });
                }}
              />
            </View>
            <View style={styles.dateForm} >
              <DateInput value={dates.availableTo} label="Available to"
                onSetValue={newdate => {
                  setDates({ ...dates, availableTo: newdate })
                }}
              />
            </View>
          </View>
          <ImagePicker onImageTaken={imageTakenHandler} />
          <LocationPicker
            pickedLocation={pickedLocation}
            navigation={props.navigation}
            onLocationPicked={locationPickedHandler}
          />
        </View>
      </ScrollView>
      <LoadingModal message="Uploading image..." isVisible={isUploadingImage} />
      <LoadingModal message="Creating place..." isVisible={isCreatingPlace} />
    </KeyboardAvoidingView>
  );
}

export const screenOptions = navData => {
  return {
    headerTitle: 'Add New Offer'
  };
};

const styles = StyleSheet.create({
  form: { margin: 20 },
  datesInputContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  dateForm: { width: '48%' },
});



