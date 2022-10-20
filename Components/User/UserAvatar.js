import { Ionicons } from '@expo/vector-icons';
import { VStack, Avatar, Text, Pressable, Box, Center, Icon } from 'native-base';
import React from 'react'

const UserAvatar = ({ photoURL, action, width, children, text, ...props }) => {
    return (
        <Pressable onPress={() => {
            if (action) {
                action()
            }
        }} alignItems="center" justifyContent="center" {...props}>
            <VStack alignItems="center" justifyContent="center">
                <Box>
                    {photoURL && <Avatar size={width}
                        source={{
                            uri: photoURL
                        }} />}
                    {!photoURL && <Center size={width} borderRadius="full" backgroundColor="gray.300">
                        <Icon color="gray.400" as={Ionicons} name="person" size={width * 0.5} />
                    </Center>}
                    {children}
                </Box>
                {text && <Text w={width} numberOfLines={1}>{text}</Text>}
            </VStack>
        </Pressable>
    )
}

export default UserAvatar