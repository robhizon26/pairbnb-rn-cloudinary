import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerItemList
} from '@react-navigation/drawer';
import { Platform, SafeAreaView, Button, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch } from 'react-redux';

 
 
import AuthScreen, {
  screenOptions as authScreenOptions
} from '../screens/user/AuthScreen';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

import DiscoverScreen, {
  screenOptions as discoverScreenOptions
} from '../screens/places/discover/Discover';
import PlaceDetailScreen, {
  screenOptions as placedetailScreenOptions
} from '../screens/places/discover/place-detail/PlaceDetail';
import MapScreen, {
  screenOptions as mapScreenOptions
} from '../screens/places/map/Map'

import OffersScreen, {
  screenOptions as offersScreenOptions
} from '../screens/places/offer/Offers';
import EditOfferScreen, {
  screenOptions as editofferScreenOptions
} from '../screens/places/offer/edit-offer/EditOffer';
import NewOfferScreen, {
  screenOptions as newofferScreenOptions
} from '../screens/places/offer/new-offer/NewOffer';

import BookingsScreen, {
  screenOptions as bookingsScreenOptions
} from '../screens/bookings/Bookings';
import CreateBookingScreen, {
  screenOptions as createBookingScreenOptions
} from '../screens/bookings/create-bookings/CreateBooking';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

const DiscoverStackNavigator = createStackNavigator();
export const DiscoverNavigator = () => {
  return (
    <DiscoverStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <DiscoverStackNavigator.Screen
        name="Discover"
        component={DiscoverScreen}
        options={discoverScreenOptions}
      />
      <DiscoverStackNavigator.Screen
        name="PlaceDetail"
        component={PlaceDetailScreen}
        options={placedetailScreenOptions}
      />
      <DiscoverStackNavigator.Screen
        name="Map"
        component={MapScreen}
        options={mapScreenOptions}
      />
      <DiscoverStackNavigator.Screen
        name="CreateBooking"
        component={CreateBookingScreen}
        options={createBookingScreenOptions}
      />
    </DiscoverStackNavigator.Navigator>
  );
};

const OffersStackNavigator = createStackNavigator();
export const OffersNavigator = () => {
  return (
    <OffersStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <OffersStackNavigator.Screen
        name="Offers"
        component={OffersScreen}
        options={offersScreenOptions}
      />
      <OffersStackNavigator.Screen
        name="EditOffer"
        component={EditOfferScreen}
        options={editofferScreenOptions}
      />
      <OffersStackNavigator.Screen
        name="NewOffer"
        component={NewOfferScreen}
        options={newofferScreenOptions}
      />
      <DiscoverStackNavigator.Screen
        name="Map"
        component={MapScreen}
        options={mapScreenOptions}
      />
    </OffersStackNavigator.Navigator>
  );
};

const PlacesTabNavigator = createBottomTabNavigator();
export const PlacesNavigator = () => {
  return (
    <PlacesTabNavigator.Navigator tabBarOptions={{
      activeTintColor: Colors.primary,
    }} >
      <PlacesTabNavigator.Screen
        name="Discover"
        component={DiscoverNavigator}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: tabInfo => {
            return (
              <Ionicons name="ios-search" size={24} color={tabInfo.color} />
            );
          },
        }}
      />
      <PlacesTabNavigator.Screen
        name="Offers"
        component={OffersNavigator}
        options={{
          tabBarLabel: 'Offers',
          tabBarIcon: tabInfo => {
            return (
              <Ionicons name="ios-card" size={24} color={tabInfo.color} />
            );
          },
        }}
      />
    </PlacesTabNavigator.Navigator>
  );
};
 
const BookingsStackNavigator = createStackNavigator();
export const BookingsNavigator = () => {
  return (
    <BookingsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <BookingsStackNavigator.Screen
        name="Bookings"
        component={BookingsScreen}
        options={bookingsScreenOptions}
      />
    </BookingsStackNavigator.Navigator>
  );
};

const MainDrawerNavigator = createDrawerNavigator();
export const MainNavigator = () => {
  const dispatch = useDispatch();
  return (
    <MainDrawerNavigator.Navigator
      drawerContent={props => {
        return (
          <View style={{ flex: 1, paddingTop: 20 }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
              <DrawerItemList {...props} />
              <Button
                title="Logout"
                color={Colors.primary}
                onPress={() => {
                  dispatch(authActions.logout());
                }}
              />
            </SafeAreaView>
          </View>
        );
      }}
      drawerContentOptions={{
        activeTintColor: Colors.primary
      }}
    >
      <MainDrawerNavigator.Screen
        name="Discover Places"
        component={PlacesNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-business' : 'ios-business'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
      <MainDrawerNavigator.Screen
        name="Your Bookings"
        component={BookingsNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-checkbox-outline' : 'ios-checkbox-outline'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
    </MainDrawerNavigator.Navigator>
  );
};

const AuthStackNavigator = createStackNavigator();
export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen
        name="Auth"
        component={AuthScreen}
        options={authScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};

  