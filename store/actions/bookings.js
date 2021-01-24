import axios from 'axios';
import Booking from '../../models/booking';
import Config from '../../constants/config'; 

export const SET_BOOKINGS = 'SET_BOOKINGS';

export const fetchBookings = () => {
    return async (dispatch, getState) => {
        const { token, userId } = getState().auth;
        try {
            let bookings = [];
            const res = await axios.get(`${Config.firebaseURL}/bookings.json?orderBy="userId"&equalTo="${userId}"&auth=${token}`);
            if (res) {
                const resData = res.data;
                for (const key in resData) {
                    if (resData.hasOwnProperty(key)) {
                        bookings.push(
                            new Booking(
                                key,
                                resData[key].placeId,
                                resData[key].userId,
                                resData[key].placeTitle,
                                resData[key].placeImage,
                                resData[key].firstName,
                                resData[key].lastName,
                                resData[key].guestNumber,
                                new Date(resData[key].bookedFrom),
                                new Date(resData[key].bookedTo)
                            )
                        );
                    }
                }
            }
            dispatch({
                type: SET_BOOKINGS,
                bookings: bookings
            });
        } catch (err) {
            throw err;
        }
    };
};

export const cancelBooking = bookingId => {
    return async (dispatch, getState) => {
        const { token } = getState().auth;
        let { bookings } = getState().bookings;
        try {
            const res = await axios.delete(`${Config.firebaseURL}/bookings/${bookingId}.json?auth=${token}`);
            if (res) {
                bookings = bookings.filter(booking => booking.id !== bookingId);
            }
            dispatch({
                type: SET_BOOKINGS,
                bookings
            });
        } catch (err) {
            throw err;
        }
    };
}

export const addBooking = async (place, bookingData, userId, token) => {
    let error, response;
    let newBooking = new Booking(
        null,
        place.id,
        userId,
        place.title,
        place.imageUrl,
        bookingData.firstname,
        bookingData.lastname,
        bookingData.guestnumber,
        bookingData.startdate,
        bookingData.enddate
    );
    await axios.post(`${Config.firebaseURL}/bookings.json?auth=${token}`, newBooking)
        .then(res => response = res)
        .catch(err => error = err);
    return { response, error };
}