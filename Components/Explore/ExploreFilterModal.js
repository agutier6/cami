import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Center, Modal, FormControl, Button, Slider, Text, HStack, Icon, Checkbox, Select } from 'native-base';
import {
    changeRadius,
    // changeMinPrice,
    changeMaxPrice,
    // addKeyword,
    // removeKeyword,
    selectRadius,
    selectType,
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
    setType
} from './exploreSlice';
import { useWindowDimensions } from 'react-native';
import { selectExploreLocation } from './exploreSlice';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';

export const ExploreFilterModal = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const radius = useSelector(selectRadius);
    const type = useSelector(selectType);
    // const keywords = useSelector(selectKeywords);
    // add ability to set min priace later
    // const minPrice = useSelector(selectMinPrice);
    const maxPrice = useSelector(selectMaxPrice);
    const [units, setUnits] = useState(true);
    const showFilterModal = useSelector(selectFilterModalVisible);
    const dispatch = useDispatch();
    const layout = useWindowDimensions();
    const radiusMax = 10000 //meters
    const radiusStep = 250 //meters
    const [radiusTemp, setRadiusTemp] = useState(radius);
    const [maxPriceTemp, setMaxPriceTemp] = useState(maxPrice);
    const [typeTemp, setTypeTemp] = useState(type);
    const location = useSelector(selectExploreLocation);
    const mapMarker = useSelector(selectExploreMapMarker);

    return (
        <Center>
            <Modal isOpen={showFilterModal && isFocused} onClose={() => {
                dispatch(closeFilterModal());
                setRadiusTemp(radius);
                setMaxPriceTemp(maxPrice);
                setTypeTemp(type);
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
                                    minValue={500} maxValue={radiusMax} accessibilityLabel="Search Radius" step={radiusStep}
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
                            <Select selectedValue={typeTemp} accessibilityLabel="Choose Category" placeholder="Choose Category"
                                onValueChange={itemValue => setTypeTemp(itemValue)}>
                                <Select.Item label="Restaurants" value="restaurant" />
                                <Select.Item label="Bars" value="bar" />
                                <Select.Item label="Cafes" value="cafe" />
                                <Select.Item label="Night Clubs" value="night_club" />
                            </Select>
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
                                setTypeTemp(type);
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
                                    dispatch(setType(typeTemp));
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