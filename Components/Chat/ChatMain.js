import React, { useEffect, useState, useLayoutEffect } from 'react';
import { AntDesignHeaderButtons } from '../Navigation/MyHeaderButtons.js';
import { Item } from 'react-navigation-header-buttons';
import { Fab, Icon, useToast, Box } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createChat, selectCreateChatStatus } from './chatSlice.js';
import { getAuth } from 'firebase/auth';

const ChatMain = ({ navigation }) => {
    const layout = useWindowDimensions();
    const toast = useToast();
    const dispatch = useDispatch()
    const createChatStatus = useSelector(selectCreateChatStatus);
    const auth = getAuth();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <AntDesignHeaderButtons>
                    <Item title="friend-requests" iconName="adduser" onPress={() => navigation.navigate("Friend Requests")} />
                </AntDesignHeaderButtons>
            ),
        });
    }, [navigation]);

    return (
        <>
            <Fab renderInPortal={false}
                shadow={2} size="sm"
                bottom={layout.height * 0.025}
                icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />}
                onPress={() => {
                    navigation.push("Add Participants");
                }} />
        </>
    )
}

export default ChatMain