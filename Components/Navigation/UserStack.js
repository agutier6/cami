import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../Screens/Home';
import Chat from '../Screens/Chat';

const Tab = createBottomTabNavigator();

export default function UserStack() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName='Home'
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Chat') {
                            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />
                    },
                    tabBarHideOnKeyboard: true,
                    tabBarStyle: { padding: 10, height: 70 },
                    tabBarLabelStyle: { paddingBottom: 10, fontSize: 12 }
                })}>
                <Tab.Screen name='Home' component={Home} options={{ headerShown: false }} />
                <Tab.Screen name='Chat' component={Chat} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}