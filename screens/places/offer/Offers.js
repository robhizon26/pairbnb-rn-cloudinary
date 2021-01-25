import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Ionicons } from '@expo/vector-icons';

import HeaderButton from '../../../components/UI/HeaderButton';
import OfferItem from '../../../components/place/OfferItem';
import Colors from '../../../constants/Colors';
import * as placesActions from '../../../store/actions/places';

const Offers = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const { places } = useSelector(state => state.places);
  const dispatch = useDispatch();

  const loadPlaces = useCallback(async () => {
    setError(null);
    try {
      await dispatch(placesActions.fetchPlaces());
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadPlaces().then(() => {
      setIsLoading(false);
    });
  }, [loadPlaces]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadPlaces}
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

  if (!isLoading && places.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No places found. Maybe start adding some!</Text>
      </View>
    );
  }

  const onRowDidOpen = rowId => {
  };
  const selectItemHandler = (rowMap, rowId, title) => {
    props.navigation.navigate('EditOffer', {
      offerId: rowId,
      placeTitle: title
    });
  };
 
  const renderItem = data => (
    <TouchableHighlight style={styles.rowFront} >
      <View>
        <OfferItem
          image={data.item.imageUrl}
          title={data.item.title}
          price={data.item.price}
          availableFrom={data.item.availableFrom}
          availableTo={data.item.availableTo}
        >
        </OfferItem>
      </View>
    </TouchableHighlight>
  );

  const editicon = Platform.OS === 'android' ? 'md-create' : 'ios-create';
  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => selectItemHandler(rowMap, data.item.id, data.item.title)}
      >
        <Ionicons name={editicon} size={25} color="#fff" style={styles.ionicons} />
      </TouchableOpacity>
    </View>
  );

  const placeListItem = (pplaces) => {
    return (
      <SwipeListView
        data={pplaces}
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
    <View style={styles.container}>{placeListItem(places)}</View>
  );
}

export const screenOptions = navData => {
  return {
    headerTitle: 'My Offers',
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
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Create Offer"
          iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
          onPress={() => {
            navData.navigation.navigate('NewOffer');
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
    margin:5
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
    backgroundColor: Colors.primary,
    right: 0,
  }
});

export default Offers;