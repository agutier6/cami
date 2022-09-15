import React, { useEffect, useState } from 'react'
import { Box, VStack, Skeleton, Text, Center } from 'native-base';
import { ExploreCard } from './ExploreCard';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPlaceIds, fetchPlaceDetails, selectPlaceIdStatus, selectPlaceIdError, selectPlaceDetails, selectPlaceDetailsStatus, selectPageSize, selectPlaceCount } from './exploreSlice';
import { FlatList } from 'native-base';

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

    const renderItem = ({ item }) => (
        <ExploreCard placeDetail={item} />
    );
    const renderEmpty = () => (
        <Text>No more data</Text>
    );

    const fetchMoreData = () => {
        if (placeIdStatus === 'succeeded' && placeDetailsStatus != 'loading') {
            dispatch(fetchPlaceDetails({ placeCount }));
            if (placeCount > pageSize - 2) {
                dispatch(fetchPlaceIds({ lat, long }));
            }
        }
    }

    if (placeIdStatus === 'failed') {
        console.log(placeIdError);
    }

    if (placeDetails.length > 0) {
        return (
            <FlatList
                data={placeDetails}
                renderItem={renderItem}
                ListEmptyComponent={renderEmpty}
                // onEndReachedThreshold={0.2}
                onEndReached={fetchMoreData}
            />
        );
    }

    return (
        <Box>
            <Center w="100%">
                <VStack w="90%" maxW="400" borderWidth="1" space={8} overflow="hidden" rounded="md" _dark={{
                    borderColor: "coolGray.500"
                }} _light={{
                    borderColor: "coolGray.200"
                }}>
                    <Skeleton h="40" />
                    <Skeleton.Text px="4" />
                    <Skeleton px="4" my="4" rounded="md" startColor="primary.100" />
                </VStack>
            </Center>
        </Box>
    )
}

export default ExploreSwipe