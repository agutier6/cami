import React from 'react';
import ExploreMain from '../Explore/ExploreMain.js';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreChangeLocation from '../Explore/ExploreChangeLocation.js';
import { AntDesignHeaderButtons } from '../Navigation/MyHeaderButtons.js';
import { Item } from 'react-navigation-header-buttons';
import { useDispatch } from 'react-redux';
import { openFilterModal } from '../Explore/exploreSlice.js';

const Stack = createStackNavigator();

function Explore() {
    const dispatch = useDispatch();

    return (
        <Stack.Navigator>
            <Stack.Screen name="Explore Main" component={ExploreMain} options={{
                title: "Explore",
                headerRight: () => (
                    <AntDesignHeaderButtons>
                        <Item title="explore-filter" iconName="filter" onPress={() => dispatch(openFilterModal())} />
                    </AntDesignHeaderButtons>
                ),
            }} />
            <Stack.Screen name="Change Location" component={ExploreChangeLocation} />
        </Stack.Navigator>
    );
}

export default Explore;