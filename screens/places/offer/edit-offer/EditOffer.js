import React, { useCallback, useEffect, useState, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../../../components/UI/HeaderButton';
import Input from '../../../../components/UI/Input';
import LoadingModal from '../../../../components/UI/LoadingModal';
import * as placesActions from '../../../../store/actions/places';

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

const EditOffer = props => {
  const [isUpdating, setIsUpdating] = useState(false);
  const offerId = props.route.params.offerId;
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  let offer = useSelector(state =>
    state.places.places.find(offer => offer.id === offerId)
  );

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: offer ? offer.title : '',
      description: offer ? offer.description : '',
    },
    inputValidities: {
      title: offer ? true : false,
      description: offer ? true : false,
    },
    formIsValid: offer ? true : false
  });

  const submitHandler = async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [{ text: 'Okay' }]);
      return;
    }
    try {
      setIsUpdating(true);
      offer = { ...offer, ...{ description: formState.inputValues.description, title: formState.inputValues.title } }
      let updateOfferData = await placesActions.updatePlace(offer, token)
      const { response, error } = updateOfferData;
      setIsUpdating(false);
      if (response) {
        await dispatch(placesActions.fetchPlaces());
        props.navigation.goBack();
      }
      if (error) {
        Alert.alert('An Error Occurred!', 'Could not update offer.', [{ text: 'Okay' }]);
      }
    } catch (err) {
      Alert.alert('An Error Occurred!', err.message, [{ text: 'Okay' }]);
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
            onPress={submitHandler}
          />
        </HeaderButtons>
      )
    });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    }, [dispatchFormState]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
    >
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
            initialValue={offer ? offer.title : ''}
            initiallyValid={!!offer}
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
            initialValue={offer ? offer.description : ''}
            initiallyValid={!!offer}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
      <LoadingModal message="Updating place..." isVisible={isUpdating} />
    </KeyboardAvoidingView>
  );
}

export const screenOptions = navData => {
  return {
    headerTitle: 'Edit Offer'
  };
};

const styles = StyleSheet.create({
  form: { margin: 20 }
});

export default EditOffer;
