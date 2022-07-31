import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { NativeBaseProvider, Input, Icon, VStack, Heading, Text, Link, Button, Box, KeyboardAvoidingView, FormControl } from 'native-base';
import { signIn } from '../../services/signIn';
import { getAuth } from 'firebase/auth';

const Login = () => {
    const navigation = useNavigation();
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [emailErrorMessage, setEmailErrorMessage] = useState();
    const auth = getAuth();


    function validateEmail() {
        const reg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/);
        if (email === undefined || email === "") {
            setEmailErrorMessage('It\'s the 21st century. You must have an email.');
            return false;
        } else if (email.length > 320) {
            setEmailErrorMessage('Not even Mr. Bonzu Pippinpaddle Oppsokopolis the Third has such a long email!');
            return false;
        } else if (reg.test(email) === false) {
            setEmailErrorMessage('Hint: It should have an @ and a . in there somewhere.');
            return false;
        } else {
            setEmailErrorMessage(undefined);
            return true;
        }
    };

    async function validateAll() {
        let emailValidation = validateEmail();
        if (emailValidation) {
            let response = await signIn(auth, email, password);
            if (!response.success) {
                createOneButtonAlert('Error', response.message, 'Try Again');
            }
        }
    }

    return (
        <NativeBaseProvider>
            <KeyboardAvoidingView alignItems="center" flex={1} justifyContent="center">
                <FormControl isInvalid={emailErrorMessage} alignItems="center" safeAreaX="3">
                    <VStack space={4} w="100%" alignItems="center" safeArea="3">

                        <Input w={{
                            base: "75%",
                            md: "25%"
                        }} InputLeftElement={<Icon as={<Entypo name="email" size={24} color="muted.700" />}
                            size={5} ml="2" color="muted.700" />} placeholder="Email"
                            value={email} onChangeText={email => setEmail(email)} />
                        <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={24} color="red" />}>
                            {emailErrorMessage}
                        </FormControl.ErrorMessage>

                        <Input w={{
                            base: "75%",
                            md: "25%"
                        }} type={show ? "text" : "password"} InputRightElement={<Icon as={<Ionicons name={show ? "eye-outline" : "eye-off-outline"} />}
                            size={5} mr="2" color="muted.700" onPress={() => setShow(!show)} />} placeholder="Password"
                            value={password} onChangeText={password => setPassword(password)} />
                        <Button onPress={() => { validateAll() }} size="md" variant="outline">
                            Log In
                        </Button>
                        <Box flexDirection="row">
                            Don't have an account?
                            <Link pl="1" onPress={() => navigation.navigate("Sign Up")}>Sign Up</Link>
                        </Box>
                        <Box flexDirection="row">
                            Forgot your password?
                            <Link pl="1" onPress={() => navigation.navigate("Recover Password")}>Recover password</Link>
                        </Box>
                    </VStack>
                </FormControl>
            </KeyboardAvoidingView>
        </NativeBaseProvider>
    )
}

export default Login;