import React, { useEffect } from 'react'
import { Box, Spinner, HStack, Text } from 'native-base';
import { ExploreCard } from './ExploreCard';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPlaceIds, selectPlaceIdStatus, selectPlaceIds, selectPlaceIdError } from './exploreSlice';

const ExploreSwipe = ({ location }) => {
    const placeIdStatus = useSelector(selectPlaceIdStatus);
    const placeIds = useSelector(selectPlaceIds);
    const placeIdError = useSelector(selectPlaceIdError);
    const dispatch = useDispatch();
    const lat = location.latitude;
    const long = location.longitude;

    useEffect(() => {
        if (placeIdStatus === 'idle') {
            dispatch(fetchPlaceIds({
                lat,
                long
            }));
        }
    }, [placeIdStatus, dispatch,]);

    if (placeIdStatus === 'loading') {
        return (
            <Box justifyContent="center" alignItems="center">
                <HStack space={8} justifyContent="center" alignItems="center">
                    <Spinner size="lg" />
                </HStack>
            </Box>
        )
    } else if (placeIdStatus === 'failed') {
        return (
            <Text>{placeIdError}</Text>
        )
    }

    return (
        <ExploreCard placeId={placeIds[0]} />
    );
}

export default ExploreSwipe