import { Box, AspectRatio, Center, Stack, Heading, HStack, Spinner, Image, Text, VStack, Skeleton } from 'native-base';
import Constants from 'expo-constants';
import React from 'react';
import { Dimensions } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { selectPlaceDetails, selectPlaceDetailsError, selectPlaceDetailsStatus } from './exploreSlice';
import { useSelector } from 'react-redux';

export const ExploreCard = ({ placeDetail }) => {
    const status = useSelector(selectPlaceDetailsStatus);
    const error = useSelector(selectPlaceDetailsError);
    const placeDetails = useSelector(selectPlaceDetails);

    if (status === 'failed') {
        console.log('Card error: ' + error);
    }

    if (!placeDetail) {
        return (
            <Box>
                <Center w="100%">
                    <VStack w="100%" maxW="400" borderWidth="1" space={8} overflow="hidden" rounded="2xl" _dark={{
                        borderColor: "coolGray.500"
                    }} _light={{
                        borderColor: "coolGray.200"
                    }}>
                        <Skeleton h={Dimensions.get('window').height * 0.5} />
                        <Skeleton.Text h={Dimensions.get('window').height * 0.2} px="4" />
                    </VStack>
                </Center>
            </Box>
        )
    }

    return (
        <Box h={Dimensions.get('window').height * 0.8} rounded="2xl" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
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
    );
};