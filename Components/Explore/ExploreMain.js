import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import ExploreSwipe from './ExploreSwipe';
import { Box, Center, VStack, Skeleton } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { AntDesignHeaderButtons } from '../Navigation/MyHeaderButtons.js';
import { Item } from 'react-navigation-header-buttons';
import { useDispatch } from 'react-redux';
import { openFilterModal } from './exploreSlice';
import { ExploreFilterModal } from './ExploreFilterModal';
import { Dimensions } from 'react-native';

function ExploreMain() {
    const [location, setLocation] = useState(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <AntDesignHeaderButtons>
                    <Item title="explore-filter" iconName="filter" onPress={() => dispatch(openFilterModal())} />
                    <Item title="user-dashboard" iconName="user" onPress={() => navigation.navigate("User Dashboard")} />
                </AntDesignHeaderButtons>
            ),
        });
    }, [navigation]);

    async function getPermissionsAndLoc() {
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status != 'granted') {
            status = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    };

    useEffect(() => {
        getPermissionsAndLoc();
    }, []);


    if (location) {
        return (<>
            <ExploreFilterModal />
            <ExploreSwipe location={location.coords} />
        </>);
    } else {
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
        );
    }
}

export default ExploreMain