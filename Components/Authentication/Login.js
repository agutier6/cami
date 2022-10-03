import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { Input, Icon, VStack, Heading, Text, Link, Button, Box, KeyboardAvoidingView, FormControl } from 'native-base';
import { signIn } from '../../services/signIn';
import { getAuth } from 'firebase/auth';
import { validateEmail } from '../../utils/validation';
import { createOneButtonAlert } from '../Alerts/OneButtonPopUp';

const Login = () => {
    const navigation = useNavigation();
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [emailErrorMessage, setEmailErrorMessage] = useState();
    const auth = getAuth();


    async function validateAndLogIn() {
        let emailValidated = validateEmail(email);
        setEmailErrorMessage(emailValidated);
        if (!emailValidated) {
            let response = await signIn(auth, email, password);
            if (!response.success) {
                createOneButtonAlert('Error', response.message, 'Try Again');
            }
        }
    }

    return (
        <KeyboardAvoidingView alignItems="center" flex={1} justifyContent="center">
            <FormControl isInvalid={emailErrorMessage} alignItems="center" safeAreaX="3">
                <VStack space={4} w="100%" alignItems="center" safeArea="3">

                    <Input w={{
                        base: "75%",
                        md: "25%"
                    }} InputLeftElement={<Icon as={<Entypo name="email" size={24} color="muted.700" />}
                        size={5} ml="2" color="muted.700" />} placeholder="Email"
                        value={email} onChangeText={email => setEmail(email)}
                        autoCapitalize='none' />
                    <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={24} color="red" />}>
                        {emailErrorMessage}
                    </FormControl.ErrorMessage>

                    <Input w={{
                        base: "75%",
                        md: "25%"
                    }} type={show ? "text" : "password"} InputRightElement={<Icon as={<Ionicons name={show ? "eye-outline" : "eye-off-outline"} />}
                        size={5} mr="2" color="muted.700" onPress={() => setShow(!show)} />}
                        InputLeftElement={<Icon as={<Ionicons name="lock-closed-outline" size={24} color="muted.700" />} size={5} ml="2" color="muted.700" />}
                        placeholder="Password"
                        value={password} onChangeText={password => setPassword(password)} />
                    <Button onPress={() => { validateAndLogIn() }} size="md" variant="outline">
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
    )
}

export default Login;