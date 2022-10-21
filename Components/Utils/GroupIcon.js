import React from 'react'
import { Avatar, Center, Icon, Box } from 'native-base'
import { Feather } from '@expo/vector-icons'

const GroupIcon = ({ size, photoURL, ...props }) => {
    return (
        <Box alignItems="center">
            {photoURL && <Avatar {...props} size={size} source={{
                uri: photoURL
            }} />}
            {!photoURL && <Center {...props} size={size} borderRadius="full" backgroundColor="gray.300">
                <Icon color="gray.400" as={Feather} name="users" size={size / 2} />
            </Center>}
        </Box>
    )
}

export default GroupIcon