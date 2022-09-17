import { getApps, GetAppResult } from 'react-native-map-link';
import { Button, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectPlaceDetails } from '../Explore/exploreSlice';


export const OpenMaps = (lat, long, name) => {
    const [availableApps, setAvailableApps] = useState([]);
    const placeDetails = useSelector(selectPlaceDetails);

    useEffect(() => {
        (async () => {
            const result = await getApps({
                latitude: placeDetails.geometry.location.lat,
                longitude: placeDetails.geometry.location.lng,
                title: placeDetails.name, // optional
                googleForceLatLon: false, // optionally force GoogleMaps to use the latlon for the query instead of the title
                alwaysIncludeGoogle: false, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
                appsWhiteList: ['google-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
            });
            setAvailableApps(result);
        })();
    }, []);

    return (
        <>
            {availableApps.map(({ icon, name, id, open }) => (
                <Button onPress={open} key={id} variant="outline" borderRadius="full" leftIcon={<Icon as={MaterialIcons} name="directions" size="sm" color="primary.500" />}>
                    {name}
                </Button>
            ))}
        </>
    );
};