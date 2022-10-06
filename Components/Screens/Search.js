import React from 'react';
import SearchMain from '../Search/SearchMain';
import UserProfile from '../User/UserProfile';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const Search = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Search People" component={SearchMain} />
            <Stack.Screen name="User Profile" component={UserProfile} />
        </Stack.Navigator>
    )
}

export default Search