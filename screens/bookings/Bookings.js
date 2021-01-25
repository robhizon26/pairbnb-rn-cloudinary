import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  Button,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Ionicons } from '@expo/vector-icons';

import HeaderButton from '../../components/UI/HeaderButton';
import BookingItem from '../../components/booking/BookingItem';
import Colors from '../../constants/Colors';
import * as bookingsActions from '../../store/actions/bookings';
import LoadingModal from '../../components/UI/LoadingModal';

const Bookings = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCancellingBooking, setIsCancellingBooking] = useState(false);
  const [error, setError] = useState();
  const { bookings } = useSelector(state => state.bookings);
  const dispatch = useDispatch();

  const loadBookings = useCallback(async () => {
    setError(null);
    try {
      await dispatch(bookingsActions.fetchBookings());
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadBookings().then(() => {
      setIsLoading(false);
    });
  }, [loadBookings]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadBookings}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && bookings.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No bookings found!</Text>
      </View>
    );
  }

  const onRowDidOpen = rowId => {
    // console.log('This row opened', rowId);
  };

  const closeRow = (rowMap, rowId) => {
    if (rowMap[rowId]) {
      rowMap[rowId].closeRow();
    }
  };

  const deleteRow = async (rowMap, rowId) => {
    setIsCancellingBooking(true)
    try {
      await dispatch(bookingsActions.cancelBooking(rowId));
      closeRow(rowMap, rowId);
    } catch (err) {
      Alert.alert('Could not cancel booking!', 'Please try again later.', [{ text: 'Okay' }]);
    }
    setIsCancellingBooking(false)
  };

  const renderItem = data => (
    <TouchableHighlight style={styles.rowFront}   >
      <View>
        <BookingItem
          placeImage={data.item.placeImage}
          placeTitle={data.item.placeTitle}
          guestNumber={data.item.guestNumber}
        >
        </BookingItem>
      </View>
    </TouchableHighlight>
  );

  const trashicon = Platform.OS === 'android' ? 'md-trash' : 'ios-trash';
  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.id)}
      >
        <Ionicons name={trashicon} size={25} color="#fff" style={styles.ionicons} />
      </TouchableOpacity>
    </View>
  );

  const bookingListItem = (bookings) => {
    return (
      <SwipeListView
        data={bookings}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={0}
        rightOpenValue={-75}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
      />
    );
  }
  return (
    <View style={styles.container}>
      {bookingListItem(bookings)}
      <LoadingModal message="Cancelling booking..." isVisible={isCancellingBooking} />
    </View>
  );
}

export const screenOptions = navData => {
  return {
    headerTitle: 'Bookings',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    flex: 1,
    margin: 5
  },
  rowFront: {
    backgroundColor: '#eee',
  },
  rowBack: {
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: Colors.accent,
    right: 0,
  }
});

export default Bookings;