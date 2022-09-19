import React, { useEffect, useState } from 'react'
import { ExploreCard } from './ExploreCard';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPlaceIds, selectPlaceIdStatus, selectPlaceIdError, selectNeedMoreData, selectExploreBuffer, concatBuffer, selectNearbySearchEndReached, fetchPlaceDetails, selectExploreLocationStatus } from './exploreSlice';
import CardSkeleton from './CardSkeleton';

const ExploreSwipe = ({ location }) => {
    const placeIdStatus = useSelector(selectPlaceIdStatus);
    const placeIdError = useSelector(selectPlaceIdError);
    const dispatch = useDispatch();
    const lat = location.latitude;
    const long = location.longitude;
    const needMoreData = useSelector(selectNeedMoreData);
    const buffer = useSelector(selectExploreBuffer);
    const nearbySearchEndReached = useSelector(selectNearbySearchEndReached);
    const locationStatus = useSelector(selectExploreLocationStatus);

    useEffect(() => {
        if (locationStatus === 'succeeded') {
            if (placeIdStatus === 'idle') {
                dispatch(fetchPlaceIds());
            }
            if (placeIdStatus === 'succeeded' && buffer.length === 0) {
                dispatch(concatBuffer());
                dispatch(fetchPlaceDetails());
            }
        }
    }, [placeIdStatus, locationStatus, dispatch,]);

    useEffect(() => {
        if (needMoreData && placeIdStatus != 'loading' && !nearbySearchEndReached) {
            dispatch(fetchPlaceIds());
        }
    }, [needMoreData]);

    if (placeIdStatus === 'failed') {
        console.log(placeIdError);
    }

    if (buffer.length > 0) {
        return (
            buffer.map((item) => {
                if (item) {
                    return <ExploreCard place={item} lat={lat} long={long} key={item.place_id} />
                }
            })
        );
    }

    return (
        <CardSkeleton />
    )
}

export default ExploreSwipe