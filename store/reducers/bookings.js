import { SET_BOOKINGS } from '../actions/bookings';

const initialState = {
  bookings: [] 
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_BOOKINGS:
      return {
        bookings: action.bookings 
      };
  }
  return state;
};
