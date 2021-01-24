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

import HeaderButton from '../../../components/UI/HeaderButton';
import Input from '../../../components/UI/Input';
import LoadingModal from '../../../components/UI/LoadingModal';
import DateInput from '../../../components/UI/DateInput';
import * as bookingsActions from '../../../store/actions/bookings';

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

export default CreateBooking = props => {
  const [isBookingPlace, setIsBookingPlace] = useState(false);
  const dispatch = useDispatch();
  const { token, userId } = useSelector(state => state.auth);
  const selectedMode = props.route.params.selectedMode;
  const selectedPlace = props.route.params.selectedPlace;

  let startDate, endDate;
  if (selectedMode == 'random') {
    const availableFrom = new Date(selectedPlace.availableFrom);
    const availableTo = new Date(selectedPlace.availableTo);
    startDate = new Date(availableFrom.getTime() + Math.random() *
      (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime()));
    endDate = new Date(startDate.getTime() + Math.random() * (startDate.getTime() +
      6 * 24 * 60 * 60 * 1000 - startDate.getTime()));
  }
  const [dates, setDates] = useState({ From: startDate, To: endDate });

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      firstname: '',
      lastname: '',
      guestnumber: 2
    },
    inputValidities: {
      firstname: false,
      lastname: false,
      guestnumber: true
    },
    formIsValid: false
  });

  const isEntryValid = () => {
    if (!formState.formIsValid) return false;
    if (!dates?.From) return false;
    if (!dates?.To) return false;
    if (dates?.From > dates?.To) return false;
    return true;
  }

  const onBookPlace = async () => {
    if (!isEntryValid()) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [{ text: 'Okay' }]);
      return;
    }
    try {
      setIsBookingPlace(true);
      const { firstname, lastname, guestnumber } = formState.inputValues;
      const bookingData = { firstname, lastname, guestnumber: +guestnumber, startdate: dates.From, enddate: dates.To };
      let addBookingData = await bookingsActions.addBooking(selectedPlace, bookingData, userId, token)
      const { response, error } = addBookingData;
      setIsBookingPlace(false);
      if (response) {
        await dispatch(bookingsActions.fetchBookings());
        props.navigation.goBack();
      }
      if (error) {
        Alert.alert('An Error Occurred!', 'Could not book place.', [{ text: 'Okay' }]);
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
            onPress={onBookPlace}
          />
        </HeaderButtons>
      )
    });
  }, [onBookPlace]);

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
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="firstname"
            label="First Name"
            errorText="Please enter a first name!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue=''
            minLength={1}
            required
          />
          <Input
            id="lastname"
            label="Last Name"
            errorText="Please enter a last name!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue=''
            minLength={1}
            required
          />
          <Input
            id="guestnumber"
            label="Number of Guests"
            errorText="Please enter a guest number!"
            keyboardType="decimal-pad"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue='2'
            required
            min={1}
          />
          <View style={styles.datesInputContainer}>
            <View style={styles.dateForm} >
              <DateInput value={dates.From} label="From"
                onSetValue={newdate => {
                  setDates({ ...dates, From: newdate });
                }}
              />
            </View>
            <View style={styles.dateForm} >
              <DateInput value={dates.To} label="To"
                onSetValue={newdate => {
                  setDates({ ...dates, To: newdate })
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <LoadingModal message="Booking place..." isVisible={isBookingPlace} />
    </KeyboardAvoidingView>
  );
}

export const screenOptions = navData => {
  return {
    headerTitle: 'Create Booking'
  };
};

const styles = StyleSheet.create({
  form: { margin: 20 },
  datesInputContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  dateForm: { width: '48%' },
});


