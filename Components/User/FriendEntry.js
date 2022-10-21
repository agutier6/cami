import React from 'react'
import { Box, VStack, HStack, Avatar, Text, Pressable, Spacer, Center, Icon } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FriendEntry({ userData, action, children, ...props }) {
    const layout = useWindowDimensions();

    if (!userData) {
        return <Box h={0}>
        </Box>
    }

    return (
        <Box borderBottomWidth="1" _dark={{
            borderColor: "muted.50"
        }} borderColor="muted.200" py="2"
            mx={layout.width * 0.025}
            {...props}>
            <Pressable w={layout.width * 0.95} onPress={() => {
                if (action) {
                    action();
                }
            }}>
                <HStack space={[2, 3]} justifyContent="space-between" >
                    <Box>
                        {userData["photoURL"] && <Avatar size={layout.height * 0.06} source={{
                            uri: userData.photoURL
                        }} />}
                        {!userData["photoURL"] && <Center size={layout.height * 0.06} borderRadius="full" backgroundColor="gray.300">
                            <Icon color="gray.400" as={Ionicons} name="person" size={layout.height * 0.03} />
                        </Center>}
                        {(userData["selected"] === true) && children}
                    </Box>
                    <VStack>
                        <Text _dark={{
                            color: "warmGray.50"
                        }} color="coolGray.800" bold>
                            {userData["username"]}
                        </Text>
                        <Text color="coolGray.600" _dark={{
                            color: "warmGray.200"
                        }}>
                            {userData["displayName"]}
                        </Text>
                    </VStack>
                    <Spacer />
                </HStack>
            </Pressable>
        </Box>
    )
}