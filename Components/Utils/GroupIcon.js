import React from 'react'
import { Avatar, Center, Icon, Box, Pressable } from 'native-base'
import { Feather } from '@expo/vector-icons'

const GroupIcon = ({ size, photoURL, isDisabled, onPress, children, ...props }) => {
    if (onPress) {
        return (
            <Pressable alignItems="center" isDisabled={isDisabled} onPress={onPress} h={size} w={size}>
                {photoURL && <Avatar {...props} size={size} source={{
                    uri: photoURL
                }} />}
                {!photoURL && <Center {...props} size={size} borderRadius="full" backgroundColor="gray.300">
                    <Icon color="gray.400" as={Feather} name="users" size={size / 2} />
                </Center>}
                {children}
            </Pressable>
        )
    } else {
        return (
            <Box alignItems="center" h={size} w={size}>
                {photoURL && <Avatar {...props} size={size} source={{
                    uri: photoURL
                }} />}
                {!photoURL && <Center {...props} size={size} borderRadius="full" backgroundColor="gray.300">
                    <Icon color="gray.400" as={Feather} name="users" size={size / 2} />
                </Center>}
                {children}
            </Box>
        )
    }

}

export default GroupIcon