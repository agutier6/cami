import React from 'react'
import { Box, VStack, HStack, Avatar, Text, Pressable, Spacer, Center, Icon } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ChatEntry({ chatData, action, children, ...props }) {
    const layout = useWindowDimensions();

    if (!chatData) {
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
                        {chatData["photoURL"] && <Avatar size={layout.height * 0.06} source={{
                            uri: chatData["photoURL"]
                        }} />}
                        {!chatData["photoURL"] && <Center size={layout.height * 0.06} borderRadius="full" backgroundColor="gray.300">
                            <Icon color="gray.400" as={Feather} name="users" size={layout.height * 0.03} />
                        </Center>}
                        {(chatData["selected"] === true) && children}
                    </Box>
                    <VStack>
                        <Text _dark={{
                            color: "warmGray.50"
                        }} color="coolGray.800" bold>
                            {chatData["name"]}
                        </Text>
                        <Text _dark={{
                            color: "warmGray.50"
                        }} color="coolGray.800">
                            {chatData["recentMessage"]}
                        </Text>
                    </VStack>
                    <Spacer />
                </HStack>
            </Pressable>
        </Box>
    )
}