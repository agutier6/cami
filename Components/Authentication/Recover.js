import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { NativeBaseProvider, Input, Icon, VStack, Button, Box, FormControl, Link } from 'native-base';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const Recover = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState();
    const [emailErrorMessage, setEmailErrorMessage] = useState();

    function validateEmail() {
        const reg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/);
        if (email === undefined || email === "") {
            setEmailErrorMessage('It\'s the 21st century. You must have an email.');
        } else if (email.length > 320) {
            setEmailErrorMessage('Not even Mr. Bonzu Pippinpaddle Oppsokopolis the Third has such a long email!');
        } else if (reg.test(email) === false) {
            setEmailErrorMessage('Hint: It should have an @ and a . in there somewhere.');
        } else {
            setEmailErrorMessage(undefined);
        }
    };

    return (
        <NativeBaseProvider>
            <FormControl isInvalid={emailErrorMessage}>
                <VStack space={4} w="100%" alignItems="center" safeArea="3">
                    <Box safeAreaX="10" safeAreaTop="10" safeAreaBottom="2">
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
                    <Button onPress={() => { validateEmail() }} size="md" variant="outline">
                        Recover
                    </Button>
                    <Box flexDirection="row">
                        Never mind, I remembered!
                        <Link pl="1" onPress={() => navigation.navigate("Log In")}>Log In</Link>
                    </Box>
                </VStack>
            </FormControl>
        </NativeBaseProvider >
    )
}

export default Recover;