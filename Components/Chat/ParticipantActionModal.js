import { Center, Modal, Button, VStack } from 'native-base';
import React, { useState, useEffect } from 'react'
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { leaveGroupChat, selectAddGroupAdminStatus, selectAddGroupAdminError, selectLeaveGroupChatError, selectLeaveGroupChatStatus, selectRemoveGroupAdminStatus, selectRemoveGroupAdminError, addGroupAdmin, removeGroupAdmin } from './chatSlice';
import { createOneButtonAlert } from '../Alerts/OneButtonPopUp';

const ParticipantActionModal = ({ openModal, setOpenModal, isAdmin, selectedUserisAdmin, displayName, userId, chatId, removeAction, adminAction }) => {
    const layout = useWindowDimensions();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const removeUserStatus = useSelector(selectLeaveGroupChatStatus);
    const removeUserError = useSelector(selectLeaveGroupChatError);
    const addGroupAdminStatus = useSelector(selectAddGroupAdminStatus);
    const addGroupAdminError = useSelector(selectAddGroupAdminError);
    const removeGroupAdminStatus = useSelector(selectRemoveGroupAdminStatus);
    const removeGroupAdminError = useSelector(selectRemoveGroupAdminError);

    const [requestId, setRequestId] = useState();

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            if (removeUserStatus[requestId] === 'succeeded') {
                removeAction();
                setOpenModal(false);
            } else if (removeUserStatus[requestId] === 'failed') {
                createOneButtonAlert('Error', removeUserError[requestId], 'Close');
            }
        }
        return () => isSubscribed = false;
    }, [removeUserStatus[requestId]])

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            if (addGroupAdminStatus[requestId] === 'succeeded') {
                adminAction();
                setOpenModal(false);
            } else if (addGroupAdminStatus[requestId] === 'failed') {
                createOneButtonAlert('Error', addGroupAdminError[requestId], 'Close');
            }
        }
        return () => isSubscribed = false;
    }, [addGroupAdminStatus[requestId]])

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            if (removeGroupAdminStatus[requestId] === 'succeeded') {
                adminAction();
                setOpenModal(false);
            } else if (removeGroupAdminStatus[requestId] === 'failed') {
                createOneButtonAlert('Error', removeGroupAdminError[requestId], 'Close');
            }
        }
        return () => isSubscribed = false;
    }, [removeGroupAdminStatus[requestId]])

    return (
        <Center>
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Content maxWidth={0.9 * layout.width}>
                    <Modal.Body keyboardShouldPersistTaps={'handled'} horizontal={false}>
                        <VStack space={layout.height * 0.01}>
                            <Button variant="ghost"
                                onPress={() => {
                                    navigation.push("User Profile", { userId: userId });
                                    setOpenModal(false);
                                }}>
                                {"View " + displayName}
                            </Button>
                            {/* <Button onPress={async () => {
                                let pickerResult = await takePicture();
                                setPhotoURL(!pickerResult.cancelled && pickerResult.uri ? pickerResult.uri : null);
                                setOpenModal(false);
                            }}>
                                Message {displayName}
                            </Button> */}
                            {isAdmin && !selectedUserisAdmin &&
                                <Button variant="ghost" colorScheme="primary" isLoading={addGroupAdminStatus[requestId] === 'loading'}
                                    isDisabled={removeUserStatus[requestId] === 'loading' || removeGroupAdminStatus[requestId] === 'loading'}
                                    onPress={() => {
                                        let request = dispatch(addGroupAdmin({ chatId: chatId, userId: userId }));
                                        setRequestId(request["requestId"]);
                                    }}>
                                    Make group admin
                                </Button>}
                            {isAdmin && selectedUserisAdmin &&
                                <Button variant="ghost" colorScheme="warning" isLoading={removeGroupAdminStatus[requestId] === 'loading'}
                                    isDisabled={addGroupAdminStatus[requestId] === 'loading' || removeUserStatus[requestId] === 'loading'}
                                    onPress={() => {
                                        let request = dispatch(removeGroupAdmin({ chatId: chatId, userId: userId }));
                                        setRequestId(request["requestId"]);
                                    }}>
                                    Dismiss as admin
                                </Button>}
                            {isAdmin &&
                                <Button variant="ghost" colorScheme="warning" isLoading={removeUserStatus[requestId] === 'loading'}
                                    isDisabled={addGroupAdminStatus[requestId] === 'loading' || removeGroupAdminStatus[requestId] === 'loading'}
                                    onPress={() => {
                                        let request = dispatch(leaveGroupChat({ chatId: chatId, userId: userId }));
                                        setRequestId(request["requestId"]);
                                    }}>
                                    {"Remove " + displayName}
                                </Button>}
                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Center >
    )
}

export default ParticipantActionModal