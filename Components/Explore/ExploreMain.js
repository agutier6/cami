import React, { useEffect, useLayoutEffect } from 'react';
import ExploreSwipe from './ExploreSwipe';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setExploreLocation, setMapMarker, setRegion } from './exploreSlice';
import { ExploreFilterModal } from './ExploreFilterModal';
import CardSkeleton from './CardSkeleton';
import PlaceDetailsModal from './PlaceDetailsModal';
import { selectLocation, selectLocationError, selectLocationStatus, subscribeLocationForeground } from './../User/userSlice';
import { Box, Text } from 'native-base';

function ExploreMain() {
    const location = useSelector(selectLocation);
    const locationStatus = useSelector(selectLocationStatus);
    const locationError = useSelector(selectLocationError);
    const dispatch = useDispatch();

    useEffect(() => {
        let isSubscribed = true
        if (locationStatus === 'idle' && isSubscribed) {
            dispatch(subscribeLocationForeground());
        }
        if (locationStatus === 'succeeded' && isSubscribed) {
            dispatch(setExploreLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }));
            dispatch(setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }));
            dispatch(setMapMarker({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }));
        }
        return () => isSubscribed = false;
    }, [locationStatus, dispatch,])

    if (locationStatus === 'succeeded') {
        return (<>
            <ExploreFilterModal />
            <PlaceDetailsModal />
            <ExploreSwipe />
        </>);
    } else if (locationStatus === 'failed') {
        <Box>
            <Text>
                {locationError}
            </Text>
        </Box>
    } else {
        return (
            <CardSkeleton />
        );
    }
}

export default ExploreMain