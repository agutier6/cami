import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Center, Modal, FormControl, Button, Slider, Text, HStack, Switch } from 'native-base';
import {
    changeRadius,
    changeMinPrice,
    changeMaxPrice,
    addType,
    removeType,
    addKeyword,
    removeKeyword,
    selectRadius,
    selectType,
    selectKeywords,
    // selectMinPrice,
    selectMaxPrice,
    closeFilterModal,
    selectFilterModalVisible,
    openFilterModal,
    selectUnits,
    toggleUnits
} from './exploreSlice';
import { Dimensions } from 'react-native';

export const ExploreFilterModal = () => {
    const radius = useSelector(selectRadius);
    const type = useSelector(selectType);
    const keywords = useSelector(selectKeywords);
    // add ability to set min priace later
    // const minPrice = useSelector(selectMinPrice);
    const maxPrice = useSelector(selectMaxPrice);
    const units = useSelector(selectUnits);
    const showModal = useSelector(selectFilterModalVisible);
    const dispatch = useDispatch();
    const screenWidth = Dimensions.get('window').width;
    const radiusMax = 5000 //meters
    const radiusStep = 250 //meters


    return (
        <Center>
            <Modal isOpen={showModal} onClose={() => dispatch(closeFilterModal())}>
                <Modal.Content maxWidth={0.9 * screenWidth}>
                    <Modal.CloseButton />
                    <Modal.Header>Filter Options</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <HStack alignItems="flex-start" space={1}>
                                <FormControl.Label>Radius</FormControl.Label>
                                <Button size="xs" width="14%" onPress={() => dispatch(toggleUnits())}>{(units ? "km" : "mi")}</Button>
                            </HStack>
                            <HStack alignItems="flex-start" space={1}>
                                <Text>{String(Math.round(radius * 10 / (units ? 1609 : 1000)) / 10)} {(units ? "mi" : "km")}</Text>
                                <Slider w="4/5" maxW={0.8 * screenWidth} defaultValue={radius}
                                    minValue={0} maxValue={radiusMax} accessibilityLabel="Search Radius" step={radiusStep}
                                    onChangeEnd={(value) => dispatch(changeRadius(value))} position="absolute" right={0}>
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
                                <Text> {'$'.repeat(maxPrice)}</Text>
                                <Slider w="4/5" maxW={0.8 * screenWidth} defaultValue={maxPrice}
                                    minValue={1} maxValue={4} accessibilityLabel="Price Level" step={1}
                                    onChangeEnd={(value) => dispatch(changeMaxPrice(value))} position="absolute" right={0}>
                                    <Slider.Track>
                                        <Slider.FilledTrack />
                                    </Slider.Track>
                                    <Slider.Thumb />
                                </Slider>
                            </HStack>
                        </FormControl>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Center >
    )
}