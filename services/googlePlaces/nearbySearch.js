import axios from 'axios';
import Constants from 'expo-constants';

export function nearbySearchByProminence(lat, long, keyword, language, minprice, maxprice, radius, type) {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
        'location=' + lat + '%2C' + long +
        '&radius=' + radius +
        '&type=' + type +
        '&keyword=' + keyword +
        '&minprice' + minprice +
        '&maxprice' + maxprice +
        '&language' + language +
        '&key=' + Constants.manifest?.extra?.placesApiKey;
    console.log('NearbySearch: ', url);
    return axios.get(url);
}