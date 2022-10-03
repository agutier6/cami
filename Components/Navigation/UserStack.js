import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { getDoc, getFirestore, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import InputUsername from '../User/InputUsername';
import { Box, Spinner } from 'native-base';

import Home from '../Screens/Home';
import Chat from '../Screens/Chat';
import Search from '../Screens/Search';

const Tab = createBottomTabNavigator();

export default function UserStack() {
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const firestore = getFirestore();
    const uid = getAuth().currentUser.uid;

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            async function getUsername() {
                const docSnap = await getDoc(doc(firestore, "users", uid));
                if (docSnap.exists() && docSnap.data()["username"]) {
                    setUsername(docSnap.data()["username"]);
                }
                setLoading(false);
            }
            getUsername();
        }
        return () => isSubscribed = false;
    }, []);

    const handleClick = () => {
        async function getUsername() {
            const docSnap = await getDoc(doc(firestore, "users", uid));
            if (docSnap.exists() && docSnap.data()["username"]) {
                setUsername(docSnap.data()["username"]);
            }
        }
        getUsername();
    }

    if (loading) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center">
                <Spinner size="lg" />
            </Box>
        )
    }

    if (!username) {
        return <InputUsername handleClick={handleClick} />;
    }
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
                        } else if (route.name === 'Search') {
                            iconName = focused ? 'search' : 'search-outline';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />
                    },
                    tabBarHideOnKeyboard: true,
                    tabBarStyle: { padding: 10, height: 70 },
                    tabBarLabelStyle: { paddingBottom: 10, fontSize: 12 },
                    tabBarActiveTintColor: theme.colors.primary.p500
                })}>
                <Tab.Screen name='Home' component={Home} options={{ headerShown: false }} />
                <Tab.Screen name='Chat' component={Chat} />
                <Tab.Screen name='Search' component={Search} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}