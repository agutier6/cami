import { Box, AspectRatio, Center, Stack, Heading, HStack, Image, Text, VStack, Skeleton } from 'native-base';
import Constants from 'expo-constants';
import React from 'react';
import { Dimensions } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { selectPlaceCount, selectPageSize, selectPlaceDetailsError, selectPlaceDetailsStatus, selectPlaceIdStatus, fetchPlaceDetails, fetchPlaceIds, popPlaceDetails } from './exploreSlice';
import { useSelector, useDispatch } from 'react-redux';
import TinderCard from 'react-tinder-card';
import CardSkeleton from './CardSkeleton';

export const ExploreCard = ({ placeDetail, lat, long }) => {
    const placeIdStatus = useSelector(selectPlaceIdStatus);
    const placeDetailsError = useSelector(selectPlaceDetailsError);
    // const placeDetails = useSelector(selectPlaceDetails);
    const placeDetailsStatus = useSelector(selectPlaceDetailsStatus);
    const pageSize = useSelector(selectPageSize);
    const placeCount = useSelector(selectPlaceCount);
    const dispatch = useDispatch();

    if (placeDetailsStatus === 'failed') {
        console.log('Card error: ' + placeDetailsError);
    }

    if (!placeDetail) {
        return (
            <TinderCard>
                <CardSkeleton />
            </TinderCard>
        )
    }

    const fetchMoreData = () => {
        if (placeIdStatus === 'succeeded' && placeDetailsStatus != 'loading') {
            dispatch(fetchPlaceDetails({ placeCount }));
            if (placeCount > pageSize - 5) {
                dispatch(fetchPlaceIds({ lat, long }));
            }
        }
    }

    return (
        <TinderCard onCardLeftScreen={() => {
            fetchMoreData();
            // dispatch(popPlaceDetails());
        }}>
            <Box position="absolute" h={Dimensions.get('window').height * 0.8} rounded="2xl" overflow="hidden" _dark={{
                borderColor: "coolGray.600",
                backgroundColor: "gray.700"
            }} _web={{
                shadow: 2,
                borderWidth: 0
            }} _light={{
                backgroundColor: "gray.50"
            }}>
                <AspectRatio w="100%" ratio={Dimensions.get('window').width / (Dimensions.get('window').height * 0.8)}>
                    <Image source={{
                        uri: `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${placeDetail.photos[0].photo_reference}&key=${Constants.manifest?.extra?.placesApiKey}&maxwidth=1600`
                    }} alt="image" />
                </AspectRatio>
                <Center mb="3" position="absolute" bottom="0" px="3" py="1.5">
                    <Stack>
                        <Heading size="2xl" color="white">{placeDetail.name}</Heading>
                        <HStack px="2" alignItems="flex-start" space={1} justifyContent="flex-start">
                            <Text fontSize="lg" _light={{
                                color: "warmGray.100"
                            }} _dark={{
                                color: "warmGray.100"
                            }} fontWeight="500" mt="-1">
                                {placeDetail.rating}
                            </Text>
                            <AirbnbRating
                                defaultRating={placeDetail.rating}
                                count={placeDetail.rating}
                                selectedColor="white"
                                size={15}
                                showRating={false}
                                isDisabled={true}
                                ratingContainerStyle={{ margin: 0, padding: 0 }}
                                starContainerStyle={{ margin: 0, padding: 0 }}
                            />
                            <Text fontSize="lg" _light={{
                                color: "warmGray.100"
                            }} _dark={{
                                color: "warmGray.100"
                            }} fontWeight="500" ml="3" mt="-1">
                                {placeDetail.user_ratings_total} reviews
                            </Text>
                            <Text fontSize="lg" _light={{
                                color: "warmGray.100"
                            }} _dark={{
                                color: "warmGray.100"
                            }} fontWeight="500" ml="3" mt="-1">
                                {'$'.repeat(placeDetail.price_level)}
                            </Text>
                        </HStack>
                    </Stack>
                </Center>
            </Box>
        </TinderCard>
    );
};