import { Box, AspectRatio, Center, Stack, Heading, HStack, Image, Text, Button } from 'native-base';
import Constants from 'expo-constants';
import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { fetchPlaceDetails, selectPlaceDetailsError, selectPlaceDetailsStatus, swipe } from './exploreSlice';
import { useSelector, useDispatch } from 'react-redux';
import TinderCard from 'react-tinder-card';
import CardSkeleton from './CardSkeleton';

export const ExploreCard = React.forwardRef((props, ref) => {
    const placeDetailsError = useSelector(selectPlaceDetailsError);
    const placeDetailsStatus = useSelector(selectPlaceDetailsStatus);
    const dispatch = useDispatch();
    const layout = useWindowDimensions();
    const photoCount = useSelector(state => state.explore.photoCount[props.index]);
    const [photoUrl, setPhotoUrl] = useState(props.place.photos ? `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${props.place.photos[0].photo_reference}&key=${Constants.manifest?.extra?.placesApiKey}&maxwidth=1600` : 'https://firebasestorage.googleapis.com/v0/b/cami-planner.appspot.com/o/photos%2Fcat_with_shades.jpg?alt=media&token=ef13423f-e3d7-4c3a-8702-a0476746fd26');
    const photos = useSelector(state => state.explore.placeDetails ? state.explore.placeDetails.photos : props.place.photos);

    useEffect(() => {
        let isSubscribed = true;
        if (photoCount > 0 && isSubscribed) {
            setPhotoUrl(photos[photoCount % photos.length].photo_reference ? `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photos[photoCount % photos.length].photo_reference}&key=${Constants.manifest?.extra?.placesApiKey}&maxwidth=1600` : 'https://firebasestorage.googleapis.com/v0/b/cami-planner.appspot.com/o/photos%2Fcat_with_shades.jpg?alt=media&token=ef13423f-e3d7-4c3a-8702-a0476746fd26');
        }
        return () => isSubscribed = false;
    }, [photoCount]);

    if (placeDetailsStatus === 'failed') {
        console.log('Card error: ' + placeDetailsError);
    }

    if (!props.place) {
        return (
            <TinderCard>
                <CardSkeleton />
            </TinderCard>
        )
    }

    return (
        <TinderCard onCardLeftScreen={() => {
            dispatch(swipe());
            dispatch(fetchPlaceDetails());
        }}
            preventSwipe={['up', 'down']}
            ref={ref}
        >
            <Box position="absolute" h={layout.height * 0.695} rounded="2xl" overflow="hidden" _dark={{
                borderColor: "coolGray.600",
                backgroundColor: "gray.700"
            }} _web={{
                shadow: 2,
                borderWidth: 0
            }} _light={{
                backgroundColor: "gray.50"
            }}>
                <AspectRatio w="100%" ratio={layout.width / (layout.height * 0.695)}>
                    <Image source={{
                        uri: photoUrl
                    }} alt="image" />
                </AspectRatio>
                <Center mb="5" position="absolute" bottom="0" px="3" py="1.5" mr={layout.width * 0.13}>
                    <Stack>
                        <Heading size="2xl" color="white">{props.place.name}</Heading>
                        <HStack px="2" alignItems="flex-start" space={1} justifyContent="flex-start">
                            <Text fontSize="lg" _light={{
                                color: "warmGray.100"
                            }} _dark={{
                                color: "warmGray.100"
                            }} fontWeight="500" mt="-1">
                                {props.place.rating}
                            </Text>
                            <AirbnbRating
                                defaultRating={props.place.rating}
                                count={props.place.rating}
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
                                {props.place.user_ratings_total} reviews
                            </Text>
                            <Text fontSize="lg" _light={{
                                color: "warmGray.100"
                            }} _dark={{
                                color: "warmGray.100"
                            }} fontWeight="500" ml="3" mt="-1">
                                {'$'.repeat(props.place.price_level)}
                            </Text>
                        </HStack>
                    </Stack>
                </Center>
            </Box>
        </TinderCard>
    );
});