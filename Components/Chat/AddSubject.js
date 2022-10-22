import { Entypo, Feather } from '@expo/vector-icons';
import { Box, VStack, HStack, Icon, Center, Input, Text, Fab, KeyboardAvoidingView, ScrollView } from 'native-base'
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
import { validateDescription, validateGroupName } from '../../utils/validation';
import GroupIcon from '../Utils/GroupIcon';

const AddSubject = ({ route, navigation }) => {
    const layout = useWindowDimensions();
    const [groupName, setGroupName] = useState(null);
    const [photoURL, setPhotoUrl] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const auth = getAuth();
    const dispatch = useDispatch();
    const createChatStatus = useSelector(selectCreateChatStatus);
    const createChatError = useSelector(selectCreateChatError);
    const [requestId, setRequestId] = useState(null);
    const [groupDescription, setGroupDescription] = useState(null)

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
            <KeyboardAvoidingView mx={layout.width * 0.05} my={layout.height * 0.025} keyboardShouldPersistTaps='handled'>
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <VStack space={layout.height * 0.05} keyboardShouldPersistTaps='handled'>
                        <HStack justifyContent="space-around" alignItems="center">
                            <GroupIcon isDisabled={createChatStatus[requestId] === 'loading'} onPress={() => setOpenModal(true)}
                                size={layout.height * 0.1}>
                                <Center alignItems="center" justifyContent="center" backgroundColor="primary.500" borderRadius="full"
                                    position="absolute" bottom={0} right={0} w={layout.height * 0.0275} h={layout.height * 0.0275}>
                                    <Icon color="white" as={Entypo} name="plus" size={layout.height * 0.02} />
                                </Center>
                            </GroupIcon>
                            <Input w={layout.width * 0.6} h={layout.height * 0.05} placeholder={"Group Name"}
                                value={groupName} onChangeText={name => setGroupName(name)}
                                isDisabled={createChatStatus[requestId] === 'loading'}
                                borderColor="muted.300" />
                        </HStack>
                        <Input w={layout.width * 0.9} multiline placeholder={"Group Description"}
                            value={groupDescription} onChangeText={desc => setGroupDescription(desc)}
                            isDisabled={createChatStatus[requestId] === 'loading'}
                            borderColor="muted.300" />
                        <VStack space={layout.height * 0.015}>
                            <Text>Participants: {route.params.groupParticipants.length}</Text>
                            <Box flexDirection="row" flexWrap="wrap">
                                {route.params.groupParticipants.map(item => {
                                    return <UserAvatar photoURL={item.photoURL} text={item.displayName} mx={layout.width * 0.025} h={layout.height * 0.1} width={layout.height * 0.06} key={item.id} />
                                })}
                            </Box>
                        </VStack>
                    </VStack>
                </ScrollView>
                <ChangePicModal setOpenModal={setOpenModal} openModal={openModal} setPhotoURL={setPhotoUrl} />
            </KeyboardAvoidingView>
            <Fab renderInPortal={false}
                shadow={2} size="sm"
                bottom={layout.height * 0.025}
                icon={<Icon color="white" as={Entypo} name="check" size="sm" />}
                isLoading={createChatStatus[requestId] === 'loading'}
                onPress={() => {
                    let groupNameErrorMessage = validateGroupName(groupName)
                    let descriptionErrorMessage = groupDescription ? validateDescription(groupDescription) : false;
                    if (route.params.groupParticipants.length > 0 && !groupNameErrorMessage && !descriptionErrorMessage) {
                        let request = dispatch(createChat({
                            sender: auth.currentUser.uid,
                            recipients: route.params.groupParticipants.map(participant => participant.id),
                            name: groupName,
                            photoURI: photoURL,
                            creatorName: auth.currentUser.displayName,
                            description: groupDescription
                        }));
                        setRequestId(request["requestId"]);
                    } else {
                        createOneButtonAlert('Error', (groupNameErrorMessage ? groupNameErrorMessage : "") + (descriptionErrorMessage ? descriptionErrorMessage : ""), 'Close');
                    }
                }} />
        </>
    )
}

export default AddSubject