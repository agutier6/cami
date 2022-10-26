import React from 'react'
import FriendsList from '../Friends/FriendsList';
import { Pressable, HStack, Text, Spacer, Center, Icon } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';

const CreateChat = ({ navigation }) => {
    const layout = useWindowDimensions();
    return (
        <FriendsList navigation={navigation} firstEntry={
            <Pressable onPress={() => navigation.push("Add Participants")}
                borderBottomWidth="1" borderTopWidth={1} _dark={{
                    borderColor: "muted.50"
                }} borderColor="muted.200" py="2"
                mx={layout.width * 0.025} w={layout.width * 0.95}>
                <HStack space={[2, 3]} alignItems="center" h={layout.height * 0.06}>
                    <Center size={layout.height * 0.06} borderRadius="full" backgroundColor="gray.300">
                        <Icon color="gray.400" as={Feather} name="user-plus" size={layout.height * 0.03} />
                    </Center>
                    <Text>
                        Create Group
                    </Text>
                    <Spacer />
                </HStack>
            </Pressable>
        } />
    )
}

export default CreateChat