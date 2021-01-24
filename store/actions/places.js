import axios from 'axios';
import Place from '../../models/place';
import Config from '../../constants/config'; 

export const SET_PLACES = 'SET_PLACES';

export const fetchPlaces = () => {
    return async (dispatch, getState) => {
        const { token, userId } = getState().auth;
        try {
            let loadedPlaces = [];
            const res = await axios.get(`${Config.firebaseURL}/offered-places.json?auth=${token}`);
            if (res) {
                const resData = res.data;
                for (const key in resData) {
                    if (resData.hasOwnProperty(key)) {
                        loadedPlaces.push(
                            new Place(
                                key,
                                resData[key].title,
                                resData[key].description,
                                resData[key].imageUrl,
                                resData[key].price,
                                new Date(resData[key].availableFrom),
                                new Date(resData[key].availableTo),
                                resData[key].userId,
                                resData[key].location
                            )
                        );
                    }
                }
            }
            dispatch({
                type: SET_PLACES,
                places: loadedPlaces,
                bookableplaces: loadedPlaces.filter(place => place.userId !== userId)
            });
        } catch (err) {
            throw err;
        }
    };
};

export const updatePlace = async (offer, token) => {
    let error, response;
    await axios.put(`${Config.firebaseURL}/offered-places/${offer.id}.json?auth=${token}`, { ...offer, id: null })
        .then(res => response = res)
        .catch(err => error = err);
    return { response, error };
}

export const cloudinaryUpload = async (imageUri) => {
    let error, imageRes;
    const source = {
        uri: imageUri,
        type: 'image/jpg',
        name: Math.random().toString()
    }
    const uploadData = new FormData();
    uploadData.append('file', source)
    uploadData.append('upload_preset', Config.cloudinaryUploadPreset)
    uploadData.append('cloud_name', Config.cloudinaryName)
    const res = await fetch(Config.cloudinaryUploadURL,
        {
            method: 'post',
            body: uploadData
        }
    );
    if (!res.ok) {
        const errorResData = await res.json();
        error = errorResData.error.message;
    } else imageRes = await res.json();
    return { imageRes, error };
}

export const addPlace = async (newPlace, token) => {
    let error, response;
    await axios.post(`${Config.firebaseURL}/offered-places.json?auth=${token}`, newPlace)
        .then(res => response = res)
        .catch(err => error = err);
    return { response, error };
}

export const getAddress = async (lat, lng) => {
    let error, address;
    await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${Config.googleMapsAPIKey}`)
        .then(res => {
            const geoData = res.data;
            if (!geoData || !geoData.results || geoData.results.length === 0) error = 'any';
            address = geoData.results[0].formatted_address;
        })
        .catch(err => error = err);
    return { address, error };
}
 