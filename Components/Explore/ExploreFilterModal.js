import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Center, Modal, FormControl, Button, Slider, Text, HStack } from 'native-base';
import {
    changeRadius,
    // changeMinPrice,
    changeMaxPrice,
    // addType,
    // removeType,
    // addKeyword,
    // removeKeyword,
    selectRadius,
    // selectType,
    // selectKeywords,
    // selectMinPrice,
    selectMaxPrice,
    closeFilterModal,
    selectFilterModalVisible,
    submitFilter
} from './exploreSlice';
import { Dimensions } from 'react-native';

export const ExploreFilterModal = () => {
    const radius = useSelector(selectRadius);
    // const type = useSelector(selectType);
    // const keywords = useSelector(selectKeywords);
    // add ability to set min priace later
    // const minPrice = useSelector(selectMinPrice);
    const maxPrice = useSelector(selectMaxPrice);
    // units doesnt need global state change later
    // const units = useSelector(selectUnits);
    const [units, setUnits] = useState(true);
    const showModal = useSelector(selectFilterModalVisible);
    const dispatch = useDispatch();
    const screenWidth = Dimensions.get('window').width;
    const radiusMax = 5000 //meters
    const radiusStep = 250 //meters
    const [radiusTemp, setRadiusTemp] = useState(radius);
    const [maxPriceTemp, setMaxPriceTemp] = useState(maxPrice);


    return (
        <Center>
            <Modal isOpen={showModal} onClose={() => {
                dispatch(closeFilterModal());
                setRadiusTemp(radius);
                setMaxPriceTemp(maxPrice);
            }}>
                <Modal.Content maxWidth={0.9 * screenWidth}>
                    <Modal.CloseButton />
                    <Modal.Header>Filter Options</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <HStack alignItems="flex-start" space={1}>
                                <FormControl.Label>Radius</FormControl.Label>
                                <Button size="xs" width="14%" onPress={() => setUnits(!units)}>{(units ? "km" : "mi")}</Button>
                            </HStack>
                            <HStack alignItems="flex-start" space={1}>
                                <Text>{String(Math.round(radiusTemp * 10 / (units ? 1609 : 1000)) / 10)} {(units ? "mi" : "km")}</Text>
                                <Slider w="4/5" maxW={0.8 * screenWidth} defaultValue={radiusTemp}
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
                            <Text>Not yet available</Text>
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Price Range</FormControl.Label>
                            <HStack alignItems="flex-start" space={1}>
                                <Text> {'$'.repeat(maxPriceTemp)}</Text>
                                <Slider w="4/5" maxW={0.8 * screenWidth} defaultValue={maxPriceTemp}
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
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                dispatch(closeFilterModal())
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={() => {
                                dispatch(closeFilterModal());
                                dispatch(changeRadius(radiusTemp));
                                dispatch(changeMaxPrice(maxPriceTemp));
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