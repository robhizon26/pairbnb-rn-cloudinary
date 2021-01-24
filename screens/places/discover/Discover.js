import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HeaderButton from '../../../components/UI/HeaderButton';
import PlaceCardItem from '../../../components/place/PlaceCardItem';
import PlaceListItem from '../../../components/place/PlaceListItem';
import Colors from '../../../constants/Colors';
import * as placesActions from '../../../store/actions/places';

export default Discover = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const { places, bookableplaces } = useSelector(state => state.places);
  const dispatch = useDispatch();

  const loadPlaces = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(placesActions.fetchPlaces());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing, setError]);

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

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('PlaceDetail', {
      placeId: id,
      placeTitle: title
    });
  };

  const placeListItem = (pplaces) => {
    return (
      <FlatList
        onRefresh={loadPlaces}
        refreshing={isRefreshing}
        data={pplaces}
        keyExtractor={item => item.id}
        renderItem={(itemData) => (
          <View>
            {itemData.index === 0 &&
              <PlaceCardItem
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                description={itemData.item.description}
                price={itemData.item.price}
                onSelect={() => {
                  selectItemHandler(itemData.item.id, itemData.item.title);
                }}
              >
              </PlaceCardItem>
            }
            {itemData.index > 0 &&
              <PlaceListItem
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                description={itemData.item.description}
                onSelect={() => {
                  selectItemHandler(itemData.item.id, itemData.item.title);
                }}
              >
              </PlaceListItem>
            }
          </View>
        )}
      />
    );
  }
  const SegmentTab = createMaterialTopTabNavigator();
  const AllPlacesSegment = () => {
    return (
      <View style={styles.container}>{placeListItem(places)}</View>
    );
  }

  const BookableSegment = () => {
    return (
      <View style={styles.container}>{placeListItem(bookableplaces)}</View>
    );
  }

  return (
    <NavigationContainer independent={true}>
      <SegmentTab.Navigator tabBarOptions={{
        activeTintColor: Colors.primary,
        inactiveTintColor: '#888',
      }}>
        <SegmentTab.Screen name="All Places" component={AllPlacesSegment} />
        <SegmentTab.Screen name="Bookable Places" component={BookableSegment} />
      </SegmentTab.Navigator>
    </NavigationContainer>
  );
}

export const screenOptions = navData => {
  return {
    headerTitle: 'Discover Places',
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
  container: { flex: 1, margin: 5 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});


