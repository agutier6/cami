import React, { useState, useEffect } from 'react'
import { nearbySearchByProminence } from '../../services/googlePlaces/nearbySearch';
import { Box, Spinner, HStack } from 'native-base';
import { ExploreCard } from './ExploreCard';
import { useSelector } from 'react-redux';
import { selectMaxPrice, selectMinPrice, selectRadius } from './exploreFilterSlice';

const ExploreSwipe = ({ location }) => {
    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPageToken, setNextPageToken] = useState();
    const [swipeCount, setSwipeCount] = useState(0);
    const searchRadius = useSelector(selectRadius);
    const minPrice = useSelector(selectMinPrice);
    const maxPrice = useSelector(selectMaxPrice);

    async function fetchData() {
        await nearbySearchByProminence(
            location.latitude,
            location.longitude,
            searchRadius,
            'restaurant',
            '',
            minPrice,
            maxPrice,
            'english'
        ).then((res) => {
            setResponse(res.data.results);
            setNextPageToken(res.data.next_page_token);
            console.log('Nearby Search Status: ', res.status);
            setLoading(false);
        }).catch((error) => {
            console.log('Error in nearby search: ', error);
        })
    }

    useEffect(() => {
        fetchData();
        // return () => {
        //     setResponse({});
        //     setStatus({});
        //     setNextPageToken({});
        //     setSwipeCount({});
        // };
    }, []);

    if (loading) {
        return (
            <Box justifyContent="center" alignItems="center">
                <HStack space={8} justifyContent="center" alignItems="center">
                    <Spinner size="lg" />
                </HStack>
            </Box>
        )
    }

    return (
        <ExploreCard placeId={response[swipeCount].place_id} />
    );
}

export default ExploreSwipe