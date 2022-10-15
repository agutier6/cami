import React from 'react';
import EditProfile from '../User/EditProfile';
import UserProfile from '../User/UserProfile';
import FriendsList from '../User/FriendsList';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const User = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="User Profile" component={UserProfile} options={{ title: "" }} />
            <Stack.Screen name="Edit Profile" component={EditProfile} />
            <Stack.Screen name="Friends" component={FriendsList} />
        </Stack.Navigator>
    )
}

export default User