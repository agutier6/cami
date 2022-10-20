import { VStack, Avatar, Text, Pressable, Box } from 'native-base';
import React from 'react'

const ParticipantAvatar = ({ userData, action, badge, width, children, ...props }) => {
    return (
        <Pressable onPress={() => {
            if (action) {
                action()
            }
        }} {...props}>
            <VStack alignItems="center" justifyContent="center">
                <Box>
                    <Avatar size={width} source={{
                        uri: userData.photoURL
                    }} />
                    {badge && children}
                </Box>
                <Text w={width} numberOfLines={1}>{userData.displayName}</Text>
            </VStack>
        </Pressable>
    )
}

export default ParticipantAvatar