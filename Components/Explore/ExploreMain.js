import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { nearbySearchByProminence } from '../../services/googlePlaces/nearbySearch';
import ExploreSwipe from './ExploreSwipe';

function ExploreMain() {
    const [location, setLocation] = useState(null);

    async function getPermissionsAndLoc() {
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status != 'granted') {
            status = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    };

    useEffect(() => {
        getPermissionsAndLoc();
        return () => {
            setLocation({}); // This worked for me
        };
    }, []);


    if (location) {
        return <ExploreSwipe location={location.coords} />;
    } else {
        return (
            <Text>Loading...</Text>
        );
    }
}

export default ExploreMain