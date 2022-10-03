import React, { useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Input, Icon, VStack, Link, Button, Box, FormControl, KeyboardAvoidingView } from 'native-base';
import { signUp } from '../../services/signUp';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { createOneButtonAlert } from '../Alerts/OneButtonPopUp';
import { validateConfirmPassword, validateEmail, validateName, validatePassword } from '../../utils/validation';

const Signup = () => {
    const auth = getAuth();

    const navigation = useNavigation();
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [nameErrorMessage, setNameErrorMessage] = useState();
    const [emailErrorMessage, setEmailErrorMessage] = useState();
    const [passwordErrorMessage, setPasswordErrorMessage] = useState();
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState();

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    async function validateAndSignUp() {
        let nameValidated = validateName(name);
        let emailValidated = validateEmail(email);
        let passwordValidated = validatePassword(password);
        let confirmPasswordValidated = validateConfirmPassword(password, confirmPassword);
        setNameErrorMessage(nameValidated);
        setEmailErrorMessage(emailValidated);
        setPasswordErrorMessage(passwordValidated);
        setConfirmPasswordErrorMessage(confirmPasswordValidated);
        if (!(nameValidated || emailValidated || passwordValidated || confirmPasswordValidated)) {
            let response = await signUp(auth, email, password, name);
            if (!response.success) {
                createOneButtonAlert('Error', response.message, 'Try Again');
            } else {
                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        createOneButtonAlert('Success', 'You\'re account has been created and we sent a verification link to your email.', 'Close');
                    })
                    .catch((error) => {
                        createOneButtonAlert('Error', error, 'Close');
                    })
            }
        }
    }

    return (
        <KeyboardAvoidingView alignItems="center" flex={1} justifyContent="center">
            <VStack space={4} w="100%" alignItems="center" safeArea="3">
                <FormControl isInvalid={nameErrorMessage} alignItems="center" safeAreaX="3">
                    <Input w={{
                        base: "75%",
                        md: "25%"
                    }} InputLeftElement={<Icon as={<Ionicons name="person-outline" size={24} color="muted.700" />}
                        size={5} ml="2" color="muted.700" />} placeholder="Name"
                        value={name} onChangeText={name => setName(name)} />
                    <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={24} color="red" />}>
                        {nameErrorMessage}
                    </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={emailErrorMessage} alignItems="center" safeAreaX="3">
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
                </FormControl>
                <FormControl isInvalid={passwordErrorMessage} alignItems="center" safeAreaX="3">
                    <Input w={{
                        base: "75%",
                        md: "25%"
                    }} type={show ? "text" : "password"}
                        InputLeftElement={<Icon as={<Ionicons name="lock-closed-outline" size={24} color="muted.700" />} size={5} ml="2" color="muted.700" />}
                        InputRightElement={<Icon as={<Ionicons name={show ? "eye-outline" : "eye-off-outline"} />}
                            size={5} mr="2" color="muted.700" onPress={() => setShow(!show)} />} placeholder="Password"
                        value={password} onChangeText={password => setPassword(password)} />
                    <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={24} color="red" />}>
                        {passwordErrorMessage}
                    </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={confirmPasswordErrorMessage} alignItems="center" safeAreaX="3">
                    <Input w={{
                        base: "75%",
                        md: "25%"
                    }} type={showConfirm ? "text" : "password"}
                        InputLeftElement={<Icon as={<Ionicons name="lock-closed-outline" size={24} color="muted.700" />} size={5} ml="2" color="muted.700" />}
                        InputRightElement={<Icon as={<Ionicons name={showConfirm ? "eye-outline" : "eye-off-outline"} />}
                            size={5} mr="2" color="muted.700" onPress={() => setShowConfirm(!showConfirm)} />} placeholder="Confirm Password"
                        value={confirmPassword} onChangeText={confirmPassword => setConfirmPassword(confirmPassword)} />
                    <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={24} color="red" />}>
                        {confirmPasswordErrorMessage}
                    </FormControl.ErrorMessage>
                </FormControl>
                <Button onPress={() => { validateAndSignUp() }} size="md" variant="outline">
                    Sign Up
                </Button>
                <Box flexDirection="row">
                    Already have an account?
                    <Link pl="1" onPress={() => navigation.navigate("Log In")}>Log In</Link>
                </Box>
            </VStack>
        </KeyboardAvoidingView>
    )
}

export default Signup;