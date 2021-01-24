import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateInput = props => {
  const { value, label, onSetValue } = props;
  const [date, setDate] = useState(value);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    onSetValue(currentDate);
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };
  const getStrDate = () => {
    return date ? date.toDateString() : '';
  }
  return (
    <View >
      <Text style={styles.label} >{label}</Text>
      <Text style={styles.dateText} onPress={showDatepicker} >{getStrDate()}</Text>
      {show && (
        <DateTimePicker
          value={date ? date : new Date()}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 5,
  },
  dateText: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginTop: 20
  }
});

export default DateInput;
