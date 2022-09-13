import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { Input, Icon, VStack, Button, Box, FormControl, Link, KeyboardAvoidingView } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { validateEmail } from '../../utils/validation';

const Recover = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState();
    const [emailErrorMessage, setEmailErrorMessage] = useState();

    return (
        <KeyboardAvoidingView alignItems="center" flex={1} justifyContent="center">
            <FormControl isInvalid={emailErrorMessage}>
                <VStack space={4} w="100%" alignItems="center" safeArea="3">
                    <Box safeAreaX="10">
                        We'll send you a recovery link if your email matches an account on our system.
                    </Box>
                    <Input w={{
                        base: "75%",
                        md: "25%"
                    }} InputLeftElement={<Icon as={<Entypo name="email" size={24} color="muted.700" />}
                        size={5} ml="2" color="muted.700" />} placeholder="Email"
                        value={email} onChangeText={email => setEmail(email)} />
                    <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={24} color="red" />}>
                        {emailErrorMessage}
                    </FormControl.ErrorMessage>
                    <Button onPress={() => { setEmailErrorMessage(validateEmail()) }} size="md" variant="outline">
                        Recover
                    </Button>
                    <Box flexDirection="row">
                        Never mind, I remembered!
                        <Link pl="1" onPress={() => navigation.navigate("Log In")}>Log In</Link>
                    </Box>
                </VStack>
            </FormControl>
        </KeyboardAvoidingView>
    )
}

export default Recover;