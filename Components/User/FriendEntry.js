import React, { useState } from 'react'
import { Box, VStack, HStack, Avatar, Text, Pressable, Spacer } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FriendEntry({ userData, action }) {
    const layout = useWindowDimensions();

    if (!userData) {
        return <Box h={0}>
        </Box>
    }

    return (
        <Box borderBottomWidth="1" _dark={{
            borderColor: "muted.50"
        }} borderColor="muted.200" py="2"
            mx={layout.width * 0.025}>
            <Pressable w={layout.width * 0.95} onPress={() => {
                action();
            }}>
                <HStack space={[2, 3]} justifyContent="space-between" >
                    <Avatar size="48px" source={{
                        uri: userData.photoURL
                    }} >
                        {(userData["selected"] === true) && <Avatar.Badge bg="green.500" />}
                    </ Avatar>
                    <VStack>
                        <Text _dark={{
                            color: "warmGray.50"
                        }} color="coolGray.800" bold>
                            {userData.username}
                        </Text>
                        <Text color="coolGray.600" _dark={{
                            color: "warmGray.200"
                        }}>
                            {userData.displayName}
                        </Text>
                    </VStack>
                    <Spacer />
                </HStack>
            </Pressable>
        </Box>
    )
}