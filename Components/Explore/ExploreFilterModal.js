import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Center, Modal, FormControl, Button, Slider, Text, HStack, Icon, Checkbox } from 'native-base';
import {
    changeRadius,
    // changeMinPrice,
    changeMaxPrice,
    // addKeyword,
    // removeKeyword,
    selectRadius,
    selectTypes,
    // selectKeywords,
    // selectMinPrice,
    selectMaxPrice,
    closeFilterModal,
    selectFilterModalVisible,
    submitFilter,
    setExploreLocation,
    selectExploreRegion,
    selectExploreMapMarker,
    setRegion,
    setMapMarker,
    setTypes
} from './exploreSlice';
import { useWindowDimensions } from 'react-native';
import { selectExploreLocation } from './exploreSlice';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';

export const ExploreFilterModal = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const radius = useSelector(selectRadius);
    const types = useSelector(selectTypes);
    // const keywords = useSelector(selectKeywords);
    // add ability to set min priace later
    // const minPrice = useSelector(selectMinPrice);
    const maxPrice = useSelector(selectMaxPrice);
    const [units, setUnits] = useState(true);
    const showFilterModal = useSelector(selectFilterModalVisible);
    const dispatch = useDispatch();
    const layout = useWindowDimensions();
    const radiusMax = 5000 //meters
    const radiusStep = 250 //meters
    const [radiusTemp, setRadiusTemp] = useState(radius);
    const [maxPriceTemp, setMaxPriceTemp] = useState(maxPrice);
    // const [typesTemp, setTypesTemp] = useState(types);
    const [restaurant, setRestaurant] = useState(types.some(type => type === 'restaurant'));
    const [bar, setBar] = useState(types.some(type => type === 'bar'));
    const [cafe, setCafe] = useState(types.some(type => type === 'cafe'));
    const [nightclub, setNightclub] = useState(types.some(type => type === 'night_club'));
    const location = useSelector(selectExploreLocation);
    const region = useSelector(selectExploreRegion);
    const mapMarker = useSelector(selectExploreMapMarker);

    return (
        <Center>
            <Modal isOpen={showFilterModal && isFocused} onClose={() => {
                dispatch(closeFilterModal());
                setRadiusTemp(radius);
                setMaxPriceTemp(maxPrice);
                setRestaurant(types.some(type => type === 'restaurant'));
                setBar(types.some(type => type === 'bar'));
                setCafe(types.some(type => type === 'cafe'));
                setNightclub(types.some(type => type === 'night_club'));
                dispatch(setRegion({
                    ...location,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }));
                dispatch(setMapMarker({
                    ...location
                }));
            }}>
                <Modal.Content maxWidth={0.9 * layout.width}>
                    <Modal.CloseButton />
                    <Modal.Header>Filter Options</Modal.Header>
                    <Modal.Body keyboardShouldPersistTaps={'handled'} horizontal={false}>
                        <Button onPress={() => {
                            // dispatch(closeFilterModal());
                            navigation.navigate("Change Location");
                        }} variant="solid" borderRadius="full"
                            leftIcon={<Icon as={Feather} name="map-pin" size="sm" color="white" />}>
                            Change Location
                        </Button>
                        <FormControl mt="3">
                            <HStack alignItems="flex-start" space={1}>
                                <FormControl.Label>Radius</FormControl.Label>
                                <Button variant="solid" borderRadius="full" size="xs" width="14%" onPress={() => setUnits(!units)}>{(units ? "km" : "mi")}</Button>
                            </HStack>
                            <HStack alignItems="flex-start" space={1}>
                                <Text>{String(Math.round(radiusTemp * 10 / (units ? 1609 : 1000)) / 10)} {(units ? "mi" : "km")}</Text>
                                <Slider w="4/5" maxW={0.8 * layout.width} defaultValue={radiusTemp}
                                    minValue={0} maxValue={radiusMax} accessibilityLabel="Search Radius" step={radiusStep}
                                    onChangeEnd={(value) => setRadiusTemp(value)} position="absolute" right={0}>
                                    <Slider.Track>
                                        <Slider.FilledTrack />
                                    </Slider.Track>
                                    <Slider.Thumb />
                                </Slider>
                            </HStack>
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Categories</FormControl.Label>
                            {/* <Checkbox.Group onChange={values => setTypesTemp(values || [])} value={typesTemp} accessibilityLabel="Choose categories">
                                <Checkbox value="restaurant">Restaurants</Checkbox>
                                <Checkbox value="cafe">Cafes</Checkbox>
                                <Checkbox value="bar">Bars</Checkbox>
                                <Checkbox value="night_club">Night Clubs</Checkbox>
                            </Checkbox.Group> */}
                            <Checkbox value="restaurant" isChecked={restaurant}
                                icon={<Icon as={Ionicons} name="restaurant" color="white" />}
                                onChange={() => setRestaurant(!restaurant)}>
                                Restaurants
                            </Checkbox>
                            <Checkbox value="cafe" isChecked={cafe}
                                icon={<Icon as={Ionicons} name="cafe" color="white" />}
                                onChange={() => setCafe(!cafe)}>
                                Cafes
                            </Checkbox>
                            <Checkbox value="bar" isChecked={bar}
                                icon={<Icon as={Ionicons} name="wine-sharp" color="white" />}
                                onChange={() => setBar(!bar)}>
                                Bars
                            </Checkbox>
                            <Checkbox value="night_club" isChecked={nightclub}
                                icon={<Icon as={Ionicons} name="disc-sharp" color="white" />}
                                onChange={() => setNightclub(!nightclub)}>
                                Night Clubs
                            </Checkbox>
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Price Range</FormControl.Label>
                            <HStack alignItems="flex-start" space={1}>
                                <Text> {'$'.repeat(maxPriceTemp)}</Text>
                                <Slider w="4/5" maxW={0.8 * layout.width} defaultValue={maxPriceTemp}
                                    minValue={1} maxValue={4} accessibilityLabel="Price Level" step={1}
                                    onChangeEnd={(value) => setMaxPriceTemp(value)} position="absolute" right={0}>
                                    <Slider.Track>
                                        <Slider.FilledTrack />
                                    </Slider.Track>
                                    <Slider.Thumb />
                                </Slider>
                            </HStack>
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" borderRadius="full" onPress={() => {
                                dispatch(closeFilterModal());
                                setRadiusTemp(radius);
                                setMaxPriceTemp(maxPrice);
                                setRestaurant(types.some(type => type === 'restaurant'));
                                setBar(types.some(type => type === 'bar'));
                                setCafe(types.some(type => type === 'cafe'));
                                setNightclub(types.some(type => type === 'night_club'));
                                dispatch(setRegion({
                                    ...location,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }));
                                dispatch(setMapMarker({
                                    ...location
                                }));
                            }}>
                                Cancel
                            </Button>
                            <Button variant="solid" borderRadius="full"
                                onPress={() => {
                                    dispatch(closeFilterModal());
                                    dispatch(changeRadius(radiusTemp));
                                    dispatch(changeMaxPrice(maxPriceTemp));
                                    dispatch(setExploreLocation(mapMarker));
                                    let typesTemp = []
                                    if (restaurant) {
                                        typesTemp = [...typesTemp, "restaurant"];
                                    }
                                    if (cafe) {
                                        typesTemp = [...typesTemp, "cafe"];
                                    }
                                    if (bar) {
                                        typesTemp = [...typesTemp, "bar"];
                                    }
                                    if (nightclub) {
                                        typesTemp = [...typesTemp, "night_club"];
                                    }
                                    dispatch(setTypes(typesTemp))
                                    dispatch(submitFilter());
                                }}>
                                Save
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Center >
    )
}