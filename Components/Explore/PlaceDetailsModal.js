import React, { useRef, useState } from 'react';
import { Box, Text, Spinner, HStack, VStack, Image, Divider, Button, Icon, Skeleton, Link } from 'native-base';
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
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { Entypo } from '@expo/vector-icons';
import PlaceOpen from '../PlaceUtils/PlaceOpen';
import { OpenMaps } from '../PlaceUtils/OpenMaps';

export default function PlaceDetailsModal() {
    const layout = useWindowDimensions();
    const headerHeight = useHeaderHeight();
    const placeDetails = useSelector(selectPlaceDetails);
    const placeDetailsStatus = useSelector(selectPlaceDetailsStatus);
    const sheetRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpening, setModalOpening] = useState(false);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Reviews' },
        { key: 'second', title: 'About' },
    ]);


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
                            <Text color="dimgrey" lineHeight={18} numberOfLines={4}>{item.text}</Text>
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

        </Box>
    );

    const renderScene = SceneMap({
        first: reviewRoute,
        second: aboutRoute,
    });

    const renderTabBar = props => (
        <>
            {modalOpening && <TabBar
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
                        {!modalOpen &&
                            <Box>
                                {renderItem(placeDetails.reviews[0], false)}
                            </Box>
                        }
                        {modalOpen &&
                            <VStack px={layout.width * 0.05} justifyContent="space-between" space="3">
                                <PlaceOpen openNow={placeDetails.opening_hours.open_now} periods={placeDetails.opening_hours.periods} pl={layout.width * 0.05} />
                                <HStack alignItems="flex-start" space="3">
                                    <OpenMaps />
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