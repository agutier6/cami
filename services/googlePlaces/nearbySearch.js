import axios from 'axios';
import Constants from 'expo-constants';

export function nearbySearchByProminence(lat, long, radius, type, minprice, maxprice, language) {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
        'location=' + lat + '%2C' + long +
        '&radius=' + radius +
        '&type=' + type +
        '&minprice=' + minprice +
        '&maxprice=' + maxprice +
        '&language=' + language +
        '&key=' + Constants.manifest?.extra?.placesApiKey;
    console.log('NearbySearch: ', url);
    return axios.get(url);
}

export function nearbySearchWithNextPageToken(lat, long, radius, type, minprice, maxprice, language, nextPageToken) {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
        'location=' + lat + '%2C' + long +
        '&radius=' + radius +
        '&type=' + type +
        '&minprice=' + minprice +
        '&maxprice=' + maxprice +
        '&language=' + language +
        '&key=' + Constants.manifest?.extra?.placesApiKey +
        '&pagetoken=' + nextPageToken;
    console.log('NextPage: ', url);
    return axios.get(url);
}