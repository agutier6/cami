import { useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Input, HStack, Button, Box } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { changeGroupName, selectChangeGroupNameError, selectChangeGroupNameStatus } from './chatSlice';
import { validateGroupName } from '../../utils/validation';
import { createOneButtonAlert } from '../Alerts/OneButtonPopUp';

const EditGroupName = ({ route, navigation }) => {
    const [newName, setNewName] = useState(route ? route.params["name"] : null);
    const [requestId, setRequestId] = useState(null);
    const layout = useWindowDimensions();
    const dispatch = useDispatch();
    const changeGroupNameStatus = useSelector(selectChangeGroupNameStatus);
    const changeGroupNameError = useSelector(selectChangeGroupNameError);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed && changeGroupNameStatus[requestId] === 'succeeded') {
            navigation.goBack();
        } else if (isSubscribed && changeGroupNameStatus[requestId] === 'failed') {
            createOneButtonAlert('Error', changeGroupNameError[requestId], 'Close');
        }
        return () => isSubscribed = false;
    }, [changeGroupNameStatus[requestId]])

    return (
        <KeyboardAvoidingView h="100%">
            <Box justifyContent="center" alignItems="center" w={layout.width} >
                <Input placeholder="Group Name" value={newName} w={layout.width * 0.95} mt={layout.height * 0.01} multiline autoFocus
                    onChangeText={(input) => setNewName(input)} isDisabled={changeGroupNameStatus[requestId] === 'loading'} />
            </Box>
            <HStack position="absolute" bottom={0} h={layout.height * 0.075} w={layout.width} px={layout.width * 0.01}
                alignItems="center" justifyContent="space-around">
                <Button variant="outline" w={layout.width * 0.475} isLoading={changeGroupNameStatus[requestId] === 'loading'}
                    onPress={() => navigation.goBack()}>
                    Cancel
                </Button>
                <Button variant="solid" w={layout.width * 0.475} isLoading={changeGroupNameStatus[requestId] === 'loading'}
                    onPress={() => {
                        let nameErrorMessage = newName ? validateGroupName(newName) : "Type a new name";
                        if (!nameErrorMessage) {
                            if (newName != route.params["name"]) {
                                let request = dispatch(changeGroupName({ chatId: route.params["chatId"], name: newName }));
                                setRequestId(request["requestId"]);
                            } else {
                                navigation.goBack();
                            }
                        } else {
                            createOneButtonAlert('Error', nameErrorMessage, 'Close');
                        }
                    }}>
                    Update
                </Button>
            </HStack>
        </KeyboardAvoidingView>
    )
}

export default EditGroupName