import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons';

const OfferItem = props => {
  const dateicon = Platform.OS === 'android' ? 'md-calendar' : 'ios-calendar';
  return (
    <TouchableOpacity onPress={props.onSelect} style={styles.placeItem}>
      <Image style={styles.image} source={{ uri: props.image }} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{props.title}</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.price}>${props.price}/night</Text>
          <View style={{ flexDirection: 'row' }}>
            <Ionicons name={dateicon} size={15} color={Colors.accent} style={styles.ionicons} />
            <Text style={styles.date}>{props.availableFrom.toLocaleDateString()} ~</Text>
            <Ionicons name={dateicon} size={15} color={Colors.accent} style={styles.ionicons} />
            <Text style={styles.date}>{props.availableTo.toLocaleDateString()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>

  );
};
const styles = StyleSheet.create({
  placeItem: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: '5%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
    backgroundColor: '#ccc',
    borderColor: Colors.primary,
    borderWidth: 1
  },
  infoContainer: {
    marginLeft: '5%',
    width: '80%',
    alignItems: 'flex-start'
  },
  title: {
    color: 'black',
    fontSize: 20,
    borderRadius: 5,
    marginVertical: 2,
    width: '100%',
    borderColor: Colors.primary,
    borderWidth: 1,
    padding: 10
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  price: {
    color: '#777',
    fontSize: 16
  },
  date: {
    color: '#777',
    fontSize: 16,
    marginEnd: 2
  },
  ionicons: {
    marginEnd: 2
  }
});

export default OfferItem;
