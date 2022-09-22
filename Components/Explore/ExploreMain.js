import React, { useEffect } from 'react';
import ExploreSwipe from './ExploreSwipe';
import { useNavigation } from '@react-navigation/native';
import { AntDesignHeaderButtons } from '../Navigation/MyHeaderButtons.js';
import { Item } from 'react-navigation-header-buttons';
import { useDispatch, useSelector } from 'react-redux';
import { openFilterModal, setExploreLocation, setMapMarker, setRegion } from './exploreSlice';
import { ExploreFilterModal } from './ExploreFilterModal';
import CardSkeleton from './CardSkeleton';
import PlaceDetailsModal from './PlaceDetailsModal';
import { selectLocation, selectLocationError, selectLocationStatus, subscribeLocationForeground } from './../User/userSlice';
import { Box, Text } from 'native-base';

function ExploreMain() {
    const location = useSelector(selectLocation);
    const locationStatus = useSelector(selectLocationStatus);
    const locationError = useSelector(selectLocationError);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (locationStatus === 'idle') {
            dispatch(subscribeLocationForeground());
        }
        if (locationStatus === 'succeeded') {
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
    }, [locationStatus, dispatch,])

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <AntDesignHeaderButtons>
                    <Item title="explore-filter" iconName="filter" onPress={() => dispatch(openFilterModal())} />
                    <Item title="user-dashboard" iconName="user" onPress={() => navigation.navigate("User Dashboard")} />
                </AntDesignHeaderButtons>
            ),
        });
    }, [navigation]);

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