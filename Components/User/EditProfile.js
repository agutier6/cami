import React, { useState, useEffect } from 'react';
import { Input, Icon, VStack, Button, FormControl, KeyboardAvoidingView, Text, Image, Box } from 'native-base';
import { getAuth, signOut, sendEmailVerification } from 'firebase/auth';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { pickProfilePhoto, takeProfilePhoto } from "../../services/imagePicker";
import { validateEmail, validateName } from "../../utils/validation";
import { changeName, changeEmail } from '../../services/updateAccount'
import { createOneButtonAlert } from '../Alerts/OneButtonPopUp'

function EditProfile() {
    const auth = getAuth();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [photoURL, setPhotoURL] = useState();
    const [nameErrorMessage, setNameErrorMessage] = useState();
    const [emailErrorMessage, setEmailErrorMessage] = useState();

    useEffect(() => {
        let isSubscribed = true;
        if (auth.currentUser && isSubscribed) {
            setName(auth.currentUser.displayName ? auth.currentUser.displayName : "");
            setEmail(auth.currentUser.email ? auth.currentUser.email : "");
            setPhotoURL(auth.currentUser.photoURL ? auth.currentUser.photoURL : "");
        }
        return () => isSubscribed = false;
    }, [auth.currentUser]);

    async function validateAndUpdate() {
        let nameValidated = validateName(name);
        let emailValidated = validateEmail(email);
        let responseMessage = '';
        setNameErrorMessage(nameValidated)
        setEmailErrorMessage(emailValidated);
        if (!(emailValidated || nameValidated)) {
            if (name != auth.currentUser.displayName) {
                const responseName = await changeName(auth.currentUser, name);
                responseMessage += responseName.success ? '' : responseName.message;
            }
            if (email != auth.currentUser.email) {
                const responseEmail = await changeEmail(auth.currentUser, email);
                responseMessage += responseEmail.success ? '' : responseEmail.message;
            }
            if (responseMessage.length > 0) {
                createOneButtonAlert('Error', 'You Brittaed it. ' + responseMessage, 'Try Again');
            }
        }
    };

    return (
        <KeyboardAvoidingView alignItems="center" >
            <VStack space={4} w="100%" alignItems="center" safeArea="3">
                <Image size={150} alt="Profile Picture" borderRadius={100} source={{
                    uri: photoURL
                }} fallbackSource={{
                    uri: "https://www.w3schools.com/css/img_lights.jpg"
                }} />
                <Button w={{
                    base: "75%",
                    md: "25%"
                }} variant="outline"
                    onPress={async () => {
                        let tempPhotoUrl = await pickProfilePhoto(auth.currentUser, auth.currentUser.uid);
                        setPhotoURL(tempPhotoUrl ? tempPhotoUrl : auth.currentUser.photoURL);
                    }}>
                    Choose Picture
                </Button>
                <Button w={{
                    base: "75%",
                    md: "25%"
                }} variant="outline"
                    onPress={async () => {
                        let tempPhotoUrl = await takeProfilePhoto(auth.currentUser, auth.currentUser.uid);
                        setPhotoURL(tempPhotoUrl ? tempPhotoUrl : auth.currentUser.photoURL);
                    }}>
                    Take Picture
                </Button>
                <FormControl isInvalid={nameErrorMessage} alignItems="center" safeAreaX="3">
                    <Input w={{
                        base: "75%",
                        md: "25%"
                    }} InputLeftElement={<Icon as={<Ionicons name="person-outline" size={24} color="muted.700" />}
                        size={5} ml="2" color="muted.700" />} placeholder={name}
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
                        size={5} ml="2" color="muted.700" />} placeholder={email}
                        value={email} onChangeText={email => setEmail(email)} />
                    <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={24} color="red" />}>
                        {emailErrorMessage}
                    </FormControl.ErrorMessage>
                </FormControl>
                {auth.emailVerified &&
                    <Box>
                        <VStack>
                            <Text>
                                It looks like your email is not verified.
                            </Text>
                            <Button onPress={() => {
                                sendEmailVerification(auth.currentUser)
                                    .catch((error) => {
                                        createOneButtonAlert('Success', 'We sent a verification email to your account.', 'Close');
                                    })
                                    .catch((error) => {
                                        createOneButtonAlert('Error', error, 'Close');
                                    })
                            }}>
                                Send verification email!
                            </Button>
                        </VStack>
                    </Box>}
                <Button w={{
                    base: "75%",
                    md: "25%"
                }} variant="outline"
                    onPress={() => validateAndUpdate()}>
                    Update
                </Button>
                <Button w={{
                    base: "75%",
                    md: "25%"
                }} variant="outline"
                    onPress={() => signOut(auth)}>
                    Sign Out
                </Button>
            </VStack>
        </KeyboardAvoidingView>
    );
}

export default EditProfile;