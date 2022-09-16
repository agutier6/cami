import React, { useEffect, useState } from 'react'
import { ExploreCard } from './ExploreCard';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPlaceIds, selectPlaceIdStatus, selectPlaceIdError, selectNeedMoreData, selectExploreBuffer, concatBuffer, selectNearbySearchEndReached } from './exploreSlice';
import CardSkeleton from './CardSkeleton';

const ExploreSwipe = ({ location }) => {
    const placeIdStatus = useSelector(selectPlaceIdStatus);
    const placeIdError = useSelector(selectPlaceIdError);
    const dispatch = useDispatch();
    const lat = location.latitude;
    const long = location.longitude;
    const [errorIds, setErrorIds] = useState(-1);
    const needMoreData = useSelector(selectNeedMoreData);
    const buffer = useSelector(selectExploreBuffer);
    const nearbySearchEndReached = useSelector(selectNearbySearchEndReached);

    useEffect(() => {
        if (placeIdStatus === 'idle') {
            dispatch(fetchPlaceIds({ lat, long }));
        }
        if (placeIdStatus === 'succeeded' && buffer.length === 0) {
            dispatch(concatBuffer());
        }
    }, [placeIdStatus, dispatch,]);

    useEffect(() => {
        if (needMoreData && placeIdStatus != 'loading' && !nearbySearchEndReached) {
            dispatch(fetchPlaceIds({ lat, long }));
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
                } else {
                    setErrorIds(errorIds + 1);
                    return <CardSkeleton key={errorIds} />;
                }
            })
        );
    }

    return (
        <CardSkeleton />
    )
}

export default ExploreSwipe