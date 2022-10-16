import React from 'react'
import { Box, VStack, HStack, Avatar, Text, Pressable, Spacer } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FriendEntry({ userData }) {
    const layout = useWindowDimensions();
    const navigation = useNavigation();

    if (!userData) {
        return <Box h={0}>
        </Box>
    }

    return (
        <Box borderBottomWidth="1" _dark={{
            borderColor: "muted.50"
        }} borderColor="muted.200" py="2"
            mx={layout.width * 0.025}>
            <HStack>
                <Pressable w={layout.width * 0.95} onPress={() => navigation.push("User Profile", { userId: userData.id })}>
                    <HStack space={[2, 3]} justifyContent="space-between" >
                        <Avatar size="48px" source={{
                            uri: userData.photoURL
                        }} />
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
            </HStack>
        </Box>
    )
}