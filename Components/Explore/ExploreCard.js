import { Box, AspectRatio, Center, Stack, Heading, HStack, Image, Text, VStack, Skeleton } from 'native-base';
import Constants from 'expo-constants';
import React from 'react';
import { Dimensions } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { selectPageSize, selectPlaceDetailsError, selectPlaceDetailsStatus, swipe } from './exploreSlice';
import { useSelector, useDispatch } from 'react-redux';
import TinderCard from 'react-tinder-card';
import CardSkeleton from './CardSkeleton';

export const ExploreCard = ({ place, lat, long }) => {
    const placeDetailsError = useSelector(selectPlaceDetailsError);
    const placeDetailsStatus = useSelector(selectPlaceDetailsStatus);
    const dispatch = useDispatch();

    if (placeDetailsStatus === 'failed') {
        console.log('Card error: ' + placeDetailsError);
    }

    if (!place) {
        return (
            <TinderCard>
                <CardSkeleton />
            </TinderCard>
        )
    }

    return (
        <TinderCard onCardLeftScreen={() => {
            dispatch(swipe());
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
                        uri: `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${place.photos[0].photo_reference}&key=${Constants.manifest?.extra?.placesApiKey}&maxwidth=1600`
                    }} alt="image" />
                </AspectRatio>
                <Center mb="3" position="absolute" bottom="0" px="3" py="1.5">
                    <Stack>
                        <Heading size="2xl" color="white">{place.name}</Heading>
                        <HStack px="2" alignItems="flex-start" space={1} justifyContent="flex-start">
                            <Text fontSize="lg" _light={{
                                color: "warmGray.100"
                            }} _dark={{
                                color: "warmGray.100"
                            }} fontWeight="500" mt="-1">
                                {place.rating}
                            </Text>
                            <AirbnbRating
                                defaultRating={place.rating}
                                count={place.rating}
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
                                {place.user_ratings_total} reviews
                            </Text>
                            <Text fontSize="lg" _light={{
                                color: "warmGray.100"
                            }} _dark={{
                                color: "warmGray.100"
                            }} fontWeight="500" ml="3" mt="-1">
                                {'$'.repeat(place.price_level)}
                            </Text>
                        </HStack>
                    </Stack>
                </Center>
            </Box>
        </TinderCard>
    );
};