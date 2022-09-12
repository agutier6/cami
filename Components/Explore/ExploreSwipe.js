import React, { useState, useEffect } from 'react'
import { nearbySearchByProminence } from '../../services/googlePlaces/nearbySearch';
import { NativeBaseProvider, Box, Spinner, HStack } from 'native-base';
import { ExploreCard } from './ExploreCard';

const ExploreSwipe = ({ location }) => {
    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPageToken, setNextPageToken] = useState();
    const [swipeCount, setSwipeCount] = useState(0);

    async function fetchData() {
        await nearbySearchByProminence(
            location.latitude,
            location.longitude,
            'restaurant',
            'english',
            '0',
            '4',
            '500',
            'restaurant'
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
            <NativeBaseProvider>
                <Box justifyContent="center" alignItems="center">
                    <HStack space={8} justifyContent="center" alignItems="center">
                        <Spinner size="lg" />
                    </HStack>
                </Box>
            </NativeBaseProvider>
        )
    }

    return (
        <NativeBaseProvider>
            <ExploreCard placeId={response[swipeCount].place_id} />
        </NativeBaseProvider>
    );
}

export default ExploreSwipe