import { Box, AspectRatio, Center, Stack, Heading, Text, HStack, Spinner, Flex } from 'native-base';
import { Rating } from 'react-native-ratings';
import Constants from 'expo-constants';
import React, { useState, useEffect } from 'react';
import { getPlaceDetails } from '../../services/googlePlaces/getPlaceDetails';
import { Dimensions, ImageBackground } from 'react-native';

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
                <AspectRatio w="100%" ratio={Dimensions.get('window').width / Dimensions.get('window').height * 0.8}>
                    <ImageBackground style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                    }} source={{
                        uri: `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${placeDetails.photos[0].photo_reference}&key=${Constants.manifest?.extra?.placesApiKey}&maxwidth=1600`
                    }} alt="image">
                        <Heading size="xl" color="white">
                            {placeDetails.name}
                        </Heading>
                        <Heading size="xl" color="white">
                            {placeDetails.rating}
                        </Heading>
                        {/* <Stack justifyContent="flex-end" p="4" space={3}>
                            <Stack space={2}>
                                
                                <HStack alignItems="center" space={4} justifyContent="space-between">
                                    <Rating
                                        type='star'
                                        ratingCount={5}
                                        imageSize={60}
                                        showRating
                                        startingValue={placeDetails.rating}
                                        isDisabled
                                    />
                                    <Text fontSize="xs" _light={{
                                        color: "violet.500"
                                    }} _dark={{
                                        color: "violet.400"
                                    }} fontWeight="500" ml="-0.5" mt="-1">
                                        {placeDetails.rating}
                                    </Text>
                                </HStack>
                            </Stack>
                            <HStack alignItems="center" space={4} justifyContent="space-between">
                                <HStack alignItems="center">
                                    <Text color="coolGray.600" _dark={{
                                        color: "warmGray.200"
                                    }} fontWeight="400">
                                        6 mins ago
                                    </Text>
                                </HStack>
                            </HStack>
                        </Stack> */}
                    </ImageBackground>
                </AspectRatio>
                {/* <Center bg="violet.500" _dark={{
                    bg: "violet.400"
                }} _text={{
                    color: "warmGray.50",
                    fontWeight: "700",
                    fontSize: "xs"
                }} position="absolute" bottom="0" px="3" py="1.5">
                    PHOTOS
                </Center> */}
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