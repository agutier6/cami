import { useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Input, HStack, Button, Box } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { editGroupDescription, selectEditGroupDescriptionError, selectEditGroupDescriptionStatus } from './chatSlice';
import { validateDescription } from '../../utils/validation';
import { createOneButtonAlert } from '../Alerts/OneButtonPopUp';

const EditGroupDescription = ({ route, navigation }) => {
    const [newDescription, setNewDescription] = useState(route ? route.params["description"] : null);
    const [requestId, setRequestId] = useState(null);
    const layout = useWindowDimensions();
    const dispatch = useDispatch();
    const editGroupDescriptionStatus = useSelector(selectEditGroupDescriptionStatus);
    const editGroupDescriptionError = useSelector(selectEditGroupDescriptionError);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed && editGroupDescriptionStatus[requestId] === 'succeeded') {
            navigation.goBack();
        } else if (isSubscribed && editGroupDescriptionStatus[requestId] === 'failed') {
            createOneButtonAlert('Error', editGroupDescriptionError[requestId], 'Close');
        }
        return () => isSubscribed = false;
    }, [editGroupDescriptionStatus[requestId]])

    return (
        <KeyboardAvoidingView h="100%">
            <Box justifyContent="center" alignItems="center" w={layout.width} >
                <Input placeholder="Add group description" value={newDescription} w={layout.width * 0.95} mt={layout.height * 0.01} multiline autoFocus
                    onChangeText={(input) => setNewDescription(input)} isDisabled={editGroupDescriptionStatus[requestId] === 'loading'} />
            </Box>
            <HStack position="absolute" bottom={0} h={layout.height * 0.075} w={layout.width} px={layout.width * 0.01}
                alignItems="center" justifyContent="space-around">
                <Button variant="outline" w={layout.width * 0.475} isLoading={editGroupDescriptionStatus[requestId] === 'loading'}
                    onPress={() => navigation.goBack()}>
                    Cancel
                </Button>
                <Button variant="solid" w={layout.width * 0.475} isLoading={editGroupDescriptionStatus[requestId] === 'loading'}
                    onPress={() => {
                        let descriptionErrorMessage = newDescription ? validateDescription(newDescription) : "Type a description";
                        if (!descriptionErrorMessage) {
                            if (newDescription != route.params["description"]) {
                                let request = dispatch(editGroupDescription({ chatId: route.params["chatId"], description: newDescription }));
                                setRequestId(request["requestId"]);
                            } else {
                                navigation.goBack();
                            }
                        } else {
                            createOneButtonAlert('Error', descriptionErrorMessage, 'Close');
                        }
                    }}>
                    Update
                </Button>
            </HStack>
        </KeyboardAvoidingView>
    )
}

export default EditGroupDescription