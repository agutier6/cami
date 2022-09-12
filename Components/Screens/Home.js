import React from 'react';
import ExploreMain from '../Explore/ExploreMain.js';
import UserDashboard from '../User/UserDashboard';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function Home() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Explore" component={ExploreMain} />
            <Stack.Screen name="User Dashboard" component={UserDashboard} />
        </Stack.Navigator>
    );
}

export default Home;