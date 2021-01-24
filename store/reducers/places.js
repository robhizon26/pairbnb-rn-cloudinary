import { SET_PLACES } from '../actions/places';

const initialState = {
  places: [],
  bookableplaces: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PLACES:
      return {
        places: action.places,
        bookableplaces: action.bookableplaces
      };
  }
  return state;
};
