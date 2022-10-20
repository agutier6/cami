import React, { useRef, useState, useEffect } from 'react';
import { Box, Text, Spinner, HStack, VStack, Image, Divider, Button, Icon, Skeleton, IconButton, Pressable } from 'native-base';
import { FlatList } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { AirbnbRating } from 'react-native-ratings';
import BottomSheet from 'reanimated-bottom-sheet';
import { useHeaderHeight } from '@react-navigation/elements';
import { useWindowDimensions, Linking } from 'react-native';
import { useSelector } from 'react-redux';
import { selectPlaceDetails, selectPlaceDetailsStatus } from './exploreSlice';
import ReadMore from '@fawazahmed/react-native-read-more';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { MaterialIcons, MaterialCommunityIcons, Feather, Entypo } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import PlaceOpen from '../Utils/PlaceOpen';
import { getApps } from 'react-native-map-link';
import * as Clipboard from 'expo-clipboard';


export default function PlaceDetailsModal() {
    const layout = useWindowDimensions();
    const headerHeight = useHeaderHeight();
    const placeDetails = useSelector(selectPlaceDetails);
    const placeDetailsStatus = useSelector(selectPlaceDetailsStatus);
    const sheetRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpening, setModalOpening] = useState(false);
    const [index, setIndex] = useState(0);
    const [availableMapApps, setAvailableMapApps] = useState([]);

    const [routes] = useState([
        { key: 'first', title: 'Reviews' },
        { key: 'second', title: 'About' },
    ]);

    useEffect(() => {
        let isSubscribed = true;
        if (placeDetailsStatus === 'succeeded' && isSubscribed && placeDetails) {
            (async () => {
                const result = await getApps({
                    latitude: placeDetails.geometry.location.lat,
                    longitude: placeDetails.geometry.location.lng,
                    title: placeDetails.name, // optional
                    googleForceLatLon: false, // optionally force GoogleMaps to use the latlon for the query instead of the title
                    alwaysIncludeGoogle: false, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
                    appsWhiteList: ['google-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
                });
                setAvailableMapApps(result);
            })();
        }
        return () => isSubscribed = false;
    }, [placeDetailsStatus]);


    const renderItem = (item, readMore) => {
        return (
            <HStack space={[2, 3]} justifyContent="space-between" alignItems="flex-start" w={layout.width * 0.9} pl={layout.width * 0.05} >
                <Image size="40px" source={{
                    uri: item.profile_photo_url
                }} alt={item.author_name} />
                <VStack width={layout.width * 0.75}>
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
                    {readMore &&
                        <ReadMore
                            numberOfLines={4}
                            style={{ color: 'dimgrey' }}
                            seeMoreText='Read more'
                            seeMoreStyle={{ color: 'deepskyblue' }}
                            seeLessText='Read less'
                            seeLessStyle={{ color: 'deepskyblue' }}
                            onExpand={() => sheetRef.current.snapTo(0)}>
                            {item.text}
                        </ReadMore>}
                    {!readMore &&
                        <Box>
                            <Text color="dimgrey" lineHeight={18} numberOfLines={3}>{item.text}</Text>
                        </Box>}
                </VStack>
            </HStack >
        );
    };

    const reviewRoute = () => (
        <Box>
            <FlatList
                data={placeDetails.reviews}
                renderItem={({ item }) => renderItem(item, true)}
                ItemSeparatorComponent={() => {
                    return <Divider my="2" _light={{
                        bg: "muted.300"
                    }} _dark={{
                        bg: "muted.50"
                    }}
                        w={layout.width * 0.9}
                        ml={layout.width * 0.05}
                    />
                }}
                keyExtractor={item => item.time}
            />
        </Box>
    );

    const aboutRoute = () => (
        <Box>
            <VStack mt={4}>
                <Divider my="2" _light={{
                    bg: "muted.300"
                }} _dark={{
                    bg: "muted.50"
                }}
                    w={layout.width * 0.9}
                    ml={layout.width * 0.05}
                />
                {availableMapApps.length > 0 &&
                    <HStack mx={6}>
                        <Pressable onPress={availableMapApps[0].open}>
                            <HStack space={3} my={2} w={layout.width * 0.8}>
                                <Icon as={Feather} name="map-pin" size="md" color="primary.500" />
                                <Text>{placeDetails.formatted_address}</Text>
                            </HStack>
                        </Pressable>
                        <IconButton size="md" variant="ghost" borderRadius={3} _icon={{
                            as: MaterialIcons,
                            name: "content-copy"
                        }} onPress={() => Clipboard.setStringAsync(placeDetails.formatted_address)} />
                    </HStack>
                }
                {availableMapApps.length === 0 &&
                    <HStack mx={6}>
                        <HStack space={3} my={2} w={layout.width * 0.8}>
                            <Icon as={Feather} name="map-pin" size="md" color="primary.500" />
                            <Text>{placeDetails.formatted_address}</Text>
                        </HStack>
                        <IconButton size="md" variant="ghost" borderRadius={3} _icon={{
                            as: MaterialIcons,
                            name: "content-copy"
                        }} onPress={() => Clipboard.setStringAsync(placeDetails.formatted_address)} />
                    </HStack>
                }
                <Divider my="2" _light={{
                    bg: "muted.300"
                }} _dark={{
                    bg: "muted.50"
                }}
                    w={layout.width * 0.9}
                    ml={layout.width * 0.05}
                />
                <HStack mx={6}>
                    <Pressable onPress={() => Linking.openURL(`tel:${placeDetails.international_phone_number ? placeDetails.international_phone_number : placeDetails.formatted_phone_number}`)}>
                        <HStack space={3} my={2} w={layout.width * 0.8}>
                            <Icon as={MaterialIcons} name="phone" size="md" color="primary.500" />
                            <Text>{placeDetails.formatted_phone_number}</Text>
                        </HStack>
                    </Pressable>
                    <IconButton size="md" variant="ghost" borderRadius={3} _icon={{
                        as: MaterialIcons,
                        name: "content-copy"
                    }} onPress={() => Clipboard.setStringAsync(placeDetails.international_phone_number ? placeDetails.international_phone_number : placeDetails.formatted_phone_number)} />
                </HStack>
                <Divider my="2" _light={{
                    bg: "muted.300"
                }} _dark={{
                    bg: "muted.50"
                }}
                    w={layout.width * 0.9}
                    ml={layout.width * 0.05}
                />
                <HStack mx={6}>
                    <Pressable onPress={() => Linking.openURL(placeDetails.website)}>
                        <HStack space={3} my={2} w={layout.width * 0.8}>
                            <Icon as={MaterialCommunityIcons} name="web" size="md" color="primary.500" />
                            <Text>{placeDetails.website}</Text>
                        </HStack>
                    </Pressable>
                    <IconButton size="md" variant="ghost" borderRadius={3} _icon={{
                        as: MaterialIcons,
                        name: "content-copy"
                    }} onPress={() => Clipboard.setStringAsync(placeDetails.website)} />
                </HStack>
                <Divider my="2" _light={{
                    bg: "muted.300"
                }} _dark={{
                    bg: "muted.50"
                }}
                    w={layout.width * 0.9}
                    ml={layout.width * 0.05}
                />
                <HStack space={3} my={2} mx={6}>
                    <Icon as={Feather} name="calendar" size="md" color="primary.500" />
                    <VStack>
                        {placeDetails.opening_hours.weekday_text.map((day, i) => <Text key={i}>{day}</Text>)}
                    </VStack>
                </HStack>
            </VStack>
        </Box>
    );

    const renderScene = SceneMap({
        first: reviewRoute,
        second: aboutRoute,
    });

    const renderTabBar = props => (
        <>
            {modalOpen && <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: theme.colors.primary.p300 }}
                style={{
                    backgroundColor: 'white'
                }}
                activeColor={theme.colors.primary.p500}
                inactiveColor={theme.colors.primary.p500}
                pressColor={theme.colors.primary.p50}
                swipeEnabled={true}
            />}
        </>
    );

    const renderContent = () => {
        return (
            <Box backgroundColor="white" h="100%">
                {placeDetailsStatus === 'succeeded' && placeDetails && modalOpen &&
                    < Box backgroundColor="white" h="100%">
                        <TabView
                            navigationState={{ index, routes }}
                            renderScene={renderScene}
                            onIndexChange={setIndex}
                            initialLayout={{ width: layout.width }}
                            renderTabBar={renderTabBar}
                        />
                    </Box>
                }
                {
                    (placeDetailsStatus != 'succeeded' || !modalOpen) &&
                    <Box>
                        <Skeleton.Text w={layout.width * 0.9} pl={layout.width * 0.03} m={5} />
                        <Skeleton.Text w={layout.width * 0.9} pl={layout.width * 0.03} m={5} />
                        <Skeleton.Text w={layout.width * 0.9} pl={layout.width * 0.03} m={5} />
                        <Skeleton.Text w={layout.width * 0.9} pl={layout.width * 0.03} m={5} />
                        <Skeleton.Text w={layout.width * 0.9} pl={layout.width * 0.03} m={5} />
                        <Skeleton.Text w={layout.width * 0.9} pl={layout.width * 0.03} m={5} />
                    </Box>

                }
            </Box >
        )
    };

    const renderHeader = () => {
        return (
            <VStack>
                <Box flexDirection="row" justifyContent="center" alignItems="center">
                    <Entypo name={!modalOpen ? "chevron-thin-up" : "chevron-thin-down"} size={24} color="white" />
                </Box >
                {placeDetailsStatus === 'succeeded' && placeDetails &&
                    <Box py={5} backgroundColor="white" borderTopRadius={16}>
                        {!modalOpen && placeDetails.reviews.length > 0 &&
                            <Box>
                                {renderItem(placeDetails.reviews[0], false)}
                            </Box>
                        }
                        {modalOpen &&
                            <VStack px={layout.width * 0.05} justifyContent="space-between" space="3">
                                <PlaceOpen openNow={placeDetails.opening_hours.open_now} periods={placeDetails.opening_hours.periods} pl={layout.width * 0.05} />
                                <HStack alignItems="flex-start" space="3">
                                    {availableMapApps.map(({ icon, name, id, open }) => (
                                        <Button onPress={open} key={id} variant="outline" borderRadius="full" leftIcon={<Icon as={MaterialIcons} name="directions" size="sm" color="primary.500" />}>
                                            {name}
                                        </Button>
                                    ))}
                                    {placeDetails.website &&
                                        <Button onPress={() => Linking.openURL(placeDetails.website)} variant="outline" borderRadius="full" leftIcon={<Icon as={MaterialIcons} name="web" size="sm" color="primary.500" />}>
                                            Website
                                        </Button>}
                                    {(placeDetails.international_phone_number || placeDetails.formatted_phone_number) &&
                                        <Button onPress={() => Linking.openURL(`tel:${placeDetails.international_phone_number ? placeDetails.international_phone_number : placeDetails.formatted_phone_number}`)}
                                            variant="outline" borderRadius="full" leftIcon={<Icon as={MaterialIcons} name="phone" size="sm" color="primary.500" />}>
                                            Call
                                        </Button>}
                                </HStack>
                            </VStack>
                        }
                    </Box>
                }
                {(placeDetailsStatus === 'loading' || placeDetailsStatus === 'idle' || !placeDetails) &&
                    <Box p={5} backgroundColor="white" borderTopRadius={16} borderBottomColor="white">
                        <Spinner color="primary.500"
                            size="lg"
                            paddingTop={(layout.height * 0.305 - headerHeight - 25) / 4} />
                    </Box>
                }
            </VStack>
        );
    }

    return (
        <BottomSheet
            ref={sheetRef}
            snapPoints={[layout.height - headerHeight - 25, layout.height * 0.305 - headerHeight - 1]}
            initialSnap={1}
            renderContent={renderContent}
            renderHeader={renderHeader}
            onOpenStart={() => setModalOpening(true)}
            onOpenEnd={() => setModalOpen(true)}
            onCloseStart={() => setModalOpening(false)}
            onCloseEnd={() => setModalOpen(false)}
            enabledContentGestureInteraction={false}
        />
    );
}