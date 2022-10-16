import React, { useEffect, useState, useLayoutEffect } from 'react';
import { AntDesignHeaderButtons } from '../Navigation/MyHeaderButtons.js';
import { Item } from 'react-navigation-header-buttons';

const ChatMain = ({ navigation }) => {

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
        <Box>

        </Box>
    )
}

export default ChatMain