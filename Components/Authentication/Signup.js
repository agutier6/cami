import { React, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeBaseProvider, Input, Icon, VStack, Heading, Text, Link, Button, Box, FormControl } from 'native-base';

const Signup = () => {
    const navigation = useNavigation();
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [usernameErrorMessage, setUsernameErrorMessage] = useState();
    const [emailErrorMessage, setEmailErrorMessage] = useState();
    const [passwordErrorMessage, setPasswordErrorMessage] = useState();
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState();

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    function validateUsername() {
        if (username === undefined || username === "") {
            setUsernameErrorMessage('A girl has no name.');
        } else if (username.length < 5 || username.length > 20) {
            setUsernameErrorMessage('Username must be between 5 and 20 characters. Cooked to perfection.');
        } else {
            setUsernameErrorMessage(undefined);
        }
    };

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

    function validatePassword() {
        let passwordErrorCount = 0;
        let tempPasswordErrorMessage = 'Password must...';
        if (password === undefined || password === "") {
            setPasswordErrorMessage('Would you leave your home without a lock?');
            return;
        } else {
            if (password.length < 8 || password.length > 20) {
                tempPasswordErrorMessage += '\n be betweeen 8 and 20 characters ';
                passwordErrorCount += 1;
            }
            if (!/[A-Z]/.test(password)) {
                tempPasswordErrorMessage += '\n contain at least one UPPERCASE character ';
                passwordErrorCount += 1;
            }
            if (!/[a-z]/.test(password)) {
                tempPasswordErrorMessage += '\n contain at least one lowercase character ';
                passwordErrorCount += 1;
            }
            if (!/[0-9]/.test(password)) {
                tempPasswordErrorMessage += '\n contain at least one number';
                passwordErrorCount += 1;
            }
            if (!/[^A-Za-z0-9]/.test(password)) {
                tempPasswordErrorMessage += '\n contain at least one special character';
                passwordErrorCount += 1;
            }
        }
        if (passwordErrorCount == 0) {
            setPasswordErrorMessage(undefined);
        } else {
            setPasswordErrorMessage(tempPasswordErrorMessage);
        }
    }

    function validateConfirmPassword() {
        if (confirmPassword === password) {
            setConfirmPasswordErrorMessage(undefined);
        } else {
            setConfirmPasswordErrorMessage('Passwords must match!');
        }
    }

    function validateAll() {
        validateUsername();
        validateEmail();
        validatePassword();
        validateConfirmPassword();
    }

    return (
        <NativeBaseProvider>
            <VStack space={4} w="100%" alignItems="center" safeArea="3">
                <FormControl isInvalid={usernameErrorMessage}>
                    <Input w={{
                        base: "75%",
                        md: "25%"
                    }} InputLeftElement={<Icon as={<Ionicons name="person-outline" size={24} color="muted.700" />}
                        size={5} ml="2" color="muted.700" />} placeholder="Username"
                        value={username} onChangeText={username => setUsername(username)} />
                    <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={24} color="red" />}>
                        {usernameErrorMessage}
                    </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={emailErrorMessage}>
                    <Input w={{
                        base: "75%",
                        md: "25%"
                    }} InputLeftElement={<Icon as={<Entypo name="email" size={24} color="muted.700" />}
                        size={5} ml="2" color="muted.700" />} placeholder="Email"
                        value={email} onChangeText={email => setEmail(email)} />
                    <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={24} color="red" />}>
                        {emailErrorMessage}
                    </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={passwordErrorMessage}>
                    <Input w={{
                        base: "75%",
                        md: "25%"
                    }} type={show ? "text" : "password"} InputRightElement={<Icon as={<Ionicons name={show ? "eye-outline" : "eye-off-outline"} />}
                        size={5} mr="2" color="muted.700" onPress={() => setShow(!show)} />} placeholder="Password"
                        value={password} onChangeText={password => setPassword(password)} />
                    <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={24} color="red" />}>
                        {passwordErrorMessage}
                    </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={confirmPasswordErrorMessage}>
                    <Input w={{
                        base: "75%",
                        md: "25%"
                    }} type={showConfirm ? "text" : "password"} InputRightElement={<Icon as={<Ionicons name={showConfirm ? "eye-outline" : "eye-off-outline"} />}
                        size={5} mr="2" color="muted.700" onPress={() => setShowConfirm(!showConfirm)} />} placeholder="Confirm Password"
                        value={confirmPassword} onChangeText={confirmPassword => setConfirmPassword(confirmPassword)} />
                    <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={24} color="red" />}>
                        {confirmPasswordErrorMessage}
                    </FormControl.ErrorMessage>
                </FormControl>
                <Button onPress={() => { validateAll() }} size="md" variant="outline">
                    Sign Up
                </Button>
                <Box flexDirection="row">
                    Already have an account?
                    <Link pl="1" onPress={() => navigation.navigate("Log In")}>Log In</Link>
                </Box>
            </VStack>
        </NativeBaseProvider>
    )
}

export default Signup;