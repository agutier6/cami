import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import ExploreSwipe from './ExploreSwipe';
import { Box, Spinner, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { AntDesignHeaderButtons } from '../Navigation/MyHeaderButtons.js';
import { Item } from 'react-navigation-header-buttons';
import { useDispatch } from 'react-redux';
import { openFilterModal } from './exploreSlice';
import { ExploreFilterModal } from './ExploreFilterModal';

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
        // return () => {
        //     setLocation({}); // This worked for me
        // };
    }, []);


    if (location) {
        return (<>
            <ExploreFilterModal />
            <ExploreSwipe location={location.coords} />
        </>);
    } else {
        return (
            <Box justifyContent="center" alignItems="center">
                <HStack space={8} justifyContent="center" alignItems="center">
                    <Spinner size="lg" />
                </HStack>
            </Box>
        );
    }
}

export default ExploreMain