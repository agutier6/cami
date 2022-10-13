import React from 'react';
import ExploreMain from '../Explore/ExploreMain.js';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreChangeLocation from '../Explore/ExploreChangeLocation.js';

const Stack = createStackNavigator();

function Home() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Explore" component={ExploreMain} />
            <Stack.Screen name="Change Location" component={ExploreChangeLocation} />
        </Stack.Navigator>
    );
}

export default Home;