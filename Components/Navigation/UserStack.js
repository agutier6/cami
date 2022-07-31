import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../Screens/Home';
import UserDashboard from '../User/UserDashboard';

const Stack = createStackNavigator();

export default function UserStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="User Dashboard" component={UserDashboard} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}