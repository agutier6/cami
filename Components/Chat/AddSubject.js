import { Entypo, Feather } from '@expo/vector-icons';
import { Box, VStack, HStack, Avatar, Pressable, Icon, Center, Input, Text, Fab, Modal, Spinner } from 'native-base'
import React, { useState } from 'react'
import { useWindowDimensions } from 'react-native';
import ChangePicModal from '../Utils/ChangePicModal';
import UserAvatar from './../User/UserAvatar';
import { useDispatch, useSelector } from 'react-redux';
import { createChat, selectCreateChatError, selectCreateChatStatus } from './chatSlice';
import { getAuth } from 'firebase/auth';
import { createOneButtonAlert } from '../Alerts/OneButtonPopUp';
import { useEffect } from 'react';
import { AntDesignHeaderButtons } from '../Navigation/MyHeaderButtons.js';
import { Item } from 'react-navigation-header-buttons';

const AddSubject = ({ route, navigation }) => {
    const layout = useWindowDimensions();
    const [photoURL, setPhotoUrl] = useState(null);
    const [groupName, setGroupName] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const auth = getAuth();
    const dispatch = useDispatch();
    const createChatStatus = useSelector(selectCreateChatStatus);
    const createChatError = useSelector(selectCreateChatError);
    const [requestId, setRequestId] = useState(null);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            navigation.setOptions({
                headerLeft: () => (
                    <AntDesignHeaderButtons>
                        <Item title="go-back" iconName="arrowleft" onPress={() => navigation.goBack()} color="black" disabled={createChatStatus[requestId] === 'loading'} />
                    </AntDesignHeaderButtons>
                ),
                gestureEnabled: createChatStatus[requestId] === 'loading'
            });
        }
        if (createChatStatus[requestId] === 'succeeded' && isSubscribed) {
            navigation.navigate("Chat");
        } else if (createChatStatus[requestId] === 'failed' && isSubscribed) {
            createOneButtonAlert('Error', createChatError, 'Close');
        }
        return () => isSubscribed = false;
    }, [createChatStatus])

    return (
        <>
            <Box mx={layout.width * 0.05} my={layout.height * 0.025}>
                <VStack space={layout.height * 0.05}>
                    <HStack justifyContent="space-around" alignItems="center">
                        <Pressable isDisabled={createChatStatus[requestId] === 'loading'} onPress={() => setOpenModal(true)}>
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
                            isDisabled={createChatStatus[requestId] === 'loading'}
                            borderColor="muted.300" />
                    </HStack>
                    <VStack space={layout.height * 0.015}>
                        <Text>Participants: {route.params.groupParticipants.length}</Text>
                        <Box flexDirection="row" flexWrap="wrap">
                            {route.params.groupParticipants.map(item => {
                                return <UserAvatar photoURL={item.photoURL} text={item.displayName} mx={layout.width * 0.025} h={layout.height * 0.1} width={layout.height * 0.06} key={item.id} />
                            })}
                        </Box>
                    </VStack>
                </VStack>
                <ChangePicModal setOpenModal={setOpenModal} openModal={openModal} setPhotoURL={setPhotoUrl} />
            </Box>
            <Fab renderInPortal={false}
                shadow={2} size="sm"
                bottom={layout.height * 0.025}
                icon={<Icon color="white" as={Entypo} name="check" size="sm" />}
                isLoading={createChatStatus[requestId] === 'loading'}
                onPress={() => {
                    if (route.params.groupParticipants.length > 0 && groupName && groupName.length > 0) {
                        let request = dispatch(createChat({
                            sender: auth.currentUser.uid,
                            recipients: route.params.groupParticipants.map(participant => participant.id),
                            name: groupName,
                            photoURI: photoURL
                        }));
                        setRequestId(request["requestId"]);
                    } else {
                        createOneButtonAlert('Error', 'Group must have a name', 'Close');
                    }
                }} />
        </>
    )
}

export default AddSubject