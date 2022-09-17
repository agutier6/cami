import React, { useRef, useState } from 'react';
import { Box, Text, Spinner, HStack, VStack, Image, Divider, Button, Icon } from 'native-base';
import { FlatList } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { AirbnbRating } from 'react-native-ratings';
import BottomSheet from 'reanimated-bottom-sheet';
import { useHeaderHeight } from '@react-navigation/elements';
import { Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { selectPlaceDetails, selectPlaceDetailsStatus } from './exploreSlice';
import ReadMore from '@fawazahmed/react-native-read-more';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function PlaceDetailsModal() {
    const headerHeight = useHeaderHeight();
    const placeDetails = useSelector(selectPlaceDetails);
    const placeDetailsStatus = useSelector(selectPlaceDetailsStatus);
    const sheetRef = useRef(null);

    const renderItem = (item) => {
        return (
            <HStack space={[2, 3]} justifyContent="space-between" w={screenWidth - 100}>
                <Image size="40px" source={{
                    uri: item.profile_photo_url
                }} alt={item.author_name} />
                <VStack>
                    <HStack justifyContent="space-between">
                        <Text _dark={{
                            color: "warmGray.50"
                        }} color="coolGray.800" bold>
                            {item.author_name}
                        </Text>
                        <Text _dark={{
                            color: "warmGray.50"
                        }} color="coolGray.800" alignSelf="flex-start" fontSize="xs">
                            {item.relative_time_description}
                        </Text>
                    </HStack>
                    <Box alignItems="flex-start">
                        <AirbnbRating
                            defaultRating={item.rating}
                            count={item.rating}
                            selectedColor="gold"
                            size={12}
                            showRating={false}
                            isDisabled={true}
                            ratingContainerStyle={{ margin: 0, padding: 0 }}
                            starContainerStyle={{ margin: 0, padding: 0 }}
                        />
                    </Box>
                    <ReadMore
                        numberOfLines={4}
                        style={{ color: 'dimgrey' }}
                        seeMoreText='Read more'
                        seeMoreStyle={{ color: 'deepskyblue' }}
                        seeLessText='Read less'
                        seeLessStyle={{ color: 'deepskyblue' }}
                        onExpand={() => sheetRef.current.snapTo(0)}>
                        {item.text}
                    </ReadMore>
                </VStack>
            </HStack>
        );
    };

    const renderContent = () => {
        if (placeDetailsStatus === 'succeeded') {
            return (
                <Box backgroundColor="white" padding={5} h="100%">
                    <FlatList
                        data={placeDetails.reviews}
                        renderItem={({ item }) => renderItem(item)}
                        ItemSeparatorComponent={() => {
                            return <Divider my="2" _light={{
                                bg: "muted.300"
                            }} _dark={{
                                bg: "muted.50"
                            }} />
                        }}
                        keyExtractor={item => item.time}
                    />
                    <HStack alignItems="flex-start" space="3" mb="5">
                        <Button variant="outline" borderRadius="full" leftIcon={<Icon as={MaterialIcons} name="directions" size="sm" color="primary.500" />}>
                            Directions
                        </Button>
                        <Button variant="outline" borderRadius="full" leftIcon={<Icon as={MaterialIcons} name="web" size="sm" color="primary.500" />}>
                            Website
                        </Button>
                        <Button variant="outline" borderRadius="full" leftIcon={<Icon as={MaterialIcons} name="phone" size="sm" color="primary.500" />}>
                            Call
                        </Button>
                    </HStack>
                </Box>
            );
        } else {
            return (
                <Box backgroundColor="white" padding={5} h="100%">
                    <Spinner color="primary.500"
                        size="lg"
                        paddingTop={(screenHeight * 0.305 - headerHeight - 25) / 4} />
                </Box>
            );
        }
    };

    return (
        <BottomSheet
            ref={sheetRef}
            snapPoints={[screenHeight - headerHeight - 25, screenHeight * 0.305 - headerHeight - 25]}
            initialSnap={1}
            borderRadius={16}
            renderContent={renderContent}
        />
    );
}