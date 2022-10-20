import { Entypo, Feather } from '@expo/vector-icons';
import { Box, VStack, HStack, Avatar, Pressable, Icon, Center, Input, Text, Fab } from 'native-base'
import React, { useState } from 'react'
import { useWindowDimensions } from 'react-native';
import ParticipantAvatar from './ParticipantAvatar';

const AddSubject = ({ route, navigation }) => {
    const layout = useWindowDimensions();
    const [photoURL, setPhotoUrl] = useState(null);
    const [groupName, setGroupName] = useState(null);

    return (
        <>
            <Box mx={layout.width * 0.05} my={layout.height * 0.025}>
                <VStack space={layout.height * 0.05}>
                    <HStack justifyContent="space-around" alignItems="center">
                        <Pressable>
                            {photoURL && <Avatar size={layout.height * 0.1} source={{
                                uri: photoURL
                            }} />}
                            {!photoURL && <Center size={layout.height * 0.1} borderRadius="full" backgroundColor="gray.300">
                                <Icon color="gray.400" as={Feather} name="camera" size={layout.height * 0.05} />
                            </Center>}
                            <Center alignItems="center" justifyContent="center" backgroundColor="primary.500" borderRadius="full"
                                position="absolute" bottom={0} right={0} w={layout.height * 0.0275} h={layout.height * 0.0275}>
                                <Icon color="white" as={Entypo} name="plus" size={layout.height * 0.02} />
                            </Center>
                        </Pressable>
                        <Input w={layout.width * 0.6} h={layout.height * 0.05} placeholder={"Group name"}
                            value={groupName} onChangeText={name => setGroupName(name)}
                            borderColor="muted.300" />
                    </HStack>
                    <VStack space={layout.height * 0.015}>
                        <Text>Participants: {route.params.groupParticipants.length}</Text>
                        <Box flexDirection="row" flexWrap="wrap">
                            {route.params.groupParticipants.map(item => {
                                return <ParticipantAvatar userData={item} alignItems="center" justifyContent="center" mx={layout.width * 0.025} h={layout.height * 0.1} width={layout.height * 0.06} />
                            })}
                        </Box>
                    </VStack>
                </VStack>
            </Box>
            <Fab renderInPortal={false}
                shadow={2} size="sm"
                bottom={layout.height * 0.025}
                icon={<Icon color="white" as={Entypo} name="check" size="sm" />}
                onPress={() => {
                    // navigation.push("Add Subject", { groupParticipants: selectedFriends });
                }} />
        </>
    )
}

export default AddSubject