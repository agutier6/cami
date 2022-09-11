import React, { useState, useEffect } from 'react'
import { nearbySearchByProminence } from '../../services/googlePlaces/nearbySearch';
import { NativeBaseProvider, Text } from 'native-base';
import { ExploreCard } from './ExploreCard';

const ExploreSwipe = ({ location }) => {
    const [response, setResponse] = useState([]);
    const [status, setStatus] = useState();
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
            setStatus(res.status);
            setResponse(res.data.results);
            setNextPageToken(res.data.next_page_token);
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        fetchData();
        return () => {
            setResponse({});
            setStatus({});
            setNextPageToken({});
            setSwipeCount({});
        };
    }, []);

    if (status == 200 && response.length > 0) {
        return (
            <NativeBaseProvider>
                {/* <Text>{response[0].name}</Text>
                <Text>{response[0].price_level}</Text>
                <Text>{response[0].rating}</Text>
                <Text>{response[0].user_ratings_total}</Text> */}
                <ExploreCard imageRef={response[swipeCount].photos[0].photo_reference}
                    name={response[swipeCount].name}
                    priceLevel={response[swipeCount].price_level}
                    rating={response[swipeCount].rating}
                    numRatings={response[swipeCount].user_ratings_total} />
            </NativeBaseProvider>
        );
    } else {
        return (
            <NativeBaseProvider>
                <Text>Loading...</Text>
            </NativeBaseProvider>
        )
    }
}

export default ExploreSwipe