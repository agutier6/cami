import { VStack, Avatar, Text, Pressable } from 'native-base';
import React from 'react'

const ParticipantAvatar = ({ userData, action, ...props }) => {
    return (
        <Pressable onPress={() => action()} {...props}>
            <VStack alignItems="center" justifyContent="center">
                <Avatar size="48px" source={{
                    uri: userData.photoURL
                }} >
                    <Avatar.Badge bg="green.500" />
                </ Avatar>
                <Text w="48px" numberOfLines={1}>{userData.displayName}</Text>
            </VStack>
        </Pressable>
    )
}

export default ParticipantAvatar