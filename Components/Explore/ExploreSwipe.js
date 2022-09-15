import React, { useEffect } from 'react'
import { ExploreCard } from './ExploreCard';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPlaceIds, fetchPlaceDetails, selectPlaceIdStatus, selectPlaceIdError, selectPlaceDetails, selectPlaceDetailsStatus, selectPageSize, selectPlaceCount } from './exploreSlice';
import CardSkeleton from './CardSkeleton';

const ExploreSwipe = ({ location }) => {
    const placeIdStatus = useSelector(selectPlaceIdStatus);
    const placeIdError = useSelector(selectPlaceIdError);
    const dispatch = useDispatch();
    const lat = location.latitude;
    const long = location.longitude;
    const placeDetails = useSelector(selectPlaceDetails);
    const placeDetailsStatus = useSelector(selectPlaceDetailsStatus);
    const pageSize = useSelector(selectPageSize);
    const placeCount = useSelector(selectPlaceCount);

    useEffect(() => {
        if (placeIdStatus === 'idle') {
            dispatch(fetchPlaceIds({ lat, long }));
        }
        if (placeIdStatus === 'succeeded') {
            dispatch(fetchPlaceDetails({ placeCount }));
        }
    }, [placeIdStatus, dispatch,]);

    const fetchMoreData = () => {
        if (placeIdStatus === 'succeeded' && placeDetailsStatus != 'loading') {
            dispatch(fetchPlaceDetails({ placeCount }));
            if (placeCount > pageSize - 5) {
                dispatch(fetchPlaceIds({ lat, long }));
            }
        }
    }

    if (placeIdStatus === 'failed') {
        console.log(placeIdError);
    }

    if (placeDetails.length > 3) {// if these number changes the refresh page id number also needs to change (make a constant later)
        return (
            placeDetails.map((item) => {
                return <ExploreCard placeDetail={item} lat={lat} long={long} key={item ? item.place_id : placeCount} />
            })
        );
    } else if (placeDetails.length > 0) {
        fetchMoreData();
    }

    return (
        <CardSkeleton />
    )
}

export default ExploreSwipe