import React from 'react';
import EditProfile from '../User/EditProfile';
import UserProfile from '../User/UserProfile';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const User = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="User Dashboard" component={UserProfile} options={{ title: "" }} />
            <Stack.Screen name="Edit Profile" component={EditProfile} />
        </Stack.Navigator>
    )
}

export default User