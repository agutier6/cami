import { Box, AspectRatio, Center, Stack, Heading, HStack, Spinner, Image, Text } from 'native-base';
import Constants from 'expo-constants';
import React, { useState, useEffect } from 'react';
import { getPlaceDetails } from '../../services/googlePlaces/getPlaceDetails';
import { Dimensions } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

export const ExploreCard = ({ placeId }) => {
    const [placeDetails, setPlaceDetails] = useState();
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        await getPlaceDetails(placeId).then((res) => {
            setPlaceDetails(res.data.result);
            console.log('Place Details Status: ', res.status);
            setLoading(false);
        }).catch((error) => {
            console.log('Error in getPlaceDetails: ', error);
        })
    }

    useEffect(() => {
        fetchData();
        // return () => {
        //     setPlaceDetails({});
        //     setStatus({});
        // };
    }, []);

    if (loading) {
        return (
            <Box alignItems="center" h="70%" m="4" rounded="2xl" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                borderColor: "coolGray.600",
                backgroundColor: "gray.700"
            }} _web={{
                shadow: 2,
                borderWidth: 0
            }} _light={{
                backgroundColor: "gray.50"
            }}>
                <HStack space={8} justifyContent="center" alignItems="center">
                    <Spinner size="lg" />
                </HStack>
            </Box>
        )
    }

    return (
        <Box safeArea="4" alignItems="center">
            <Box h="90%" rounded="2xl" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
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
                        uri: `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${placeDetails.photos[0].photo_reference}&key=${Constants.manifest?.extra?.placesApiKey}&maxwidth=1600`
                    }} alt="image" />
                </AspectRatio>
                <Center mb="3" position="absolute" bottom="0" px="3" py="1.5">
                    <Stack>
                        <Heading size="2xl" color="white">{placeDetails.name}</Heading>
                        <HStack px="2" alignItems="flex-start" space={1} justifyContent="flex-start">
                            <Text fontSize="lg" _light={{
                                color: "warmGray.100"
                            }} _dark={{
                                color: "warmGray.100"
                            }} fontWeight="500" mt="-1">
                                {placeDetails.rating}
                            </Text>
                            <AirbnbRating
                                defaultRating={placeDetails.rating}
                                count={placeDetails.rating}
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
                                {placeDetails.user_ratings_total} reviews
                            </Text>
                            <Text fontSize="lg" _light={{
                                color: "warmGray.100"
                            }} _dark={{
                                color: "warmGray.100"
                            }} fontWeight="500" ml="3" mt="-1">
                                {'$'.repeat(placeDetails.price_level)}
                            </Text>
                        </HStack>
                    </Stack>
                </Center>
            </Box>
            {/* <Box h="40%" mx="4" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                borderColor: "coolGray.600",
                backgroundColor: "gray.700"
            }} _web={{
                shadow: 2,
                borderWidth: 0
            }} _light={{
                backgroundColor: "gray.50"
            }}>
            </Box> */}
        </Box>
    );
};