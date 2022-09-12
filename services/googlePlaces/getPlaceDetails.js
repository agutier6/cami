import axios from 'axios';
import Constants from 'expo-constants';

export function getPlaceDetails(placeId) {
    const url = 'https://maps.googleapis.com/maps/api/place/details/json?' +
        'place_id=' + placeId +
        '&key=' + Constants.manifest?.extra?.placesApiKey;
    console.log('getPlaceDetails: ', url);
    return axios.get(url);
}