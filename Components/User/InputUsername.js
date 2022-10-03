import { getAuth } from 'firebase/auth';
import { Input, VStack, Button, FormControl, KeyboardAvoidingView, Text } from 'native-base';
import React, { useState } from 'react';
import { validateUsername } from '../../utils/validation';
import { setUsernameFirestore } from '../../services/signUp';
import { Ionicons } from '@expo/vector-icons';
import { createOneButtonAlert } from '../Alerts/OneButtonPopUp';


const InputUsername = ({ handleClick }) => {
    const auth = getAuth();
    const [usernameErrorMessage, setUsernameErrorMessage] = useState();
    const [username, setUsername] = useState();


    async function submitUsername() {
        let usernameValidated = await validateUsername(username);
        setUsernameErrorMessage(usernameValidated);
        if (!usernameValidated) {
            let response = await setUsernameFirestore(auth, username);
            if (!response.success) {
                createOneButtonAlert('Error', response.message, 'Try Again');
            }
        }
    }

    return (
        <KeyboardAvoidingView alignItems="center" flex={1} justifyContent="center">
            <VStack alignItems="center" flex={1} justifyContent="center" space={3}>
                <Text>Choose a username</Text>
                <FormControl isInvalid={usernameErrorMessage} alignItems="center" safeAreaX="3">
                    <Input w={{
                        base: "75%",
                        md: "25%"
                    }} placeholder="Username"
                        value={username} onChangeText={username => setUsername(username)}
                        autoCapitalize='none' />
                    <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={24} color="red" />}>
                        {usernameErrorMessage}
                    </FormControl.ErrorMessage>
                </FormControl>
                <Button onPress={() => { submitUsername(); handleClick(); }} size="md" variant="outline">
                    Submit
                </Button>
            </VStack>
        </KeyboardAvoidingView>
    )
}

export default InputUsername;