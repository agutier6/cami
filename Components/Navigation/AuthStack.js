import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../Authentication/Login';
import Signup from '../Authentication/Signup';
import Recover from '../Authentication/Recover';
import Welcome from '../Screens/Welcome';

const Stack = createStackNavigator();

export default function AuthStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="Log In" component={Login} />
                <Stack.Screen name="Sign Up" component={Signup} />
                <Stack.Screen name="Recover Password" component={Recover} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}