import { Center, Modal, Button, VStack } from 'native-base';
import { pickImage, takePicture } from "../../services/imagePicker";
import React, { useState, useEffect } from 'react'
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { leaveGroupChat, selectLeaveGroupChatError, selectLeaveGroupChatStatus } from './chatSlice';
import { createOneButtonAlert } from '../Alerts/OneButtonPopUp';

const ParticipantActionModal = ({ openModal, setOpenModal, isAdmin, displayName, userId, chatId, removeAction }) => {
    const layout = useWindowDimensions();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const removeUserStatus = useSelector(selectLeaveGroupChatStatus);
    const removeUserError = useSelector(selectLeaveGroupChatError);
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

    return (
        <Center>
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Content maxWidth={0.9 * layout.width}>
                    <Modal.Body keyboardShouldPersistTaps={'handled'} horizontal={false}>
                        <VStack space={layout.height * 0.01}>
                            <Button variant="outline"
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
                            {isAdmin &&
                                <Button variant="ghost" colorScheme="warning" isLoading={removeUserStatus[requestId] === 'loading'}
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