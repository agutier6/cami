import React, { useState, useEffect } from 'react';
import { Input, Icon, VStack, Button, FormControl, KeyboardAvoidingView, Text, Center, Box } from 'native-base';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { Ionicons, Entypo, Feather } from '@expo/vector-icons';
import { handleUserImagePicked } from "../../services/imagePicker";
import { validateDescription, validateEmail, validateName } from "../../utils/validation";
import { changeName, changeEmail, changeDescription } from '../../services/updateAccount';
import { createOneButtonAlert } from '../Alerts/OneButtonPopUp';
import { useWindowDimensions } from 'react-native';
import ChangePicModal from '../Utils/ChangePicModal';
import UserAvatar from './UserAvatar';

function EditProfile({ route, navigation }) {
    const auth = getAuth();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [description, setDescription] = useState(route.params ? route.params.desc : "");
    const [oldDescription] = useState(route.params ? route.params.desc : "");
    const [photoURL, setPhotoURL] = useState();
    const [nameErrorMessage, setNameErrorMessage] = useState();
    const [emailErrorMessage, setEmailErrorMessage] = useState();
    const [descriptionErrorMessage, setDescriptionErrorMesssage] = useState();
    const layout = useWindowDimensions();
    const [uploading, setUploading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            setName(auth.currentUser["displayName"] ? auth.currentUser.displayName : "");
            setEmail(auth.currentUser["email"] ? auth.currentUser.email : "");
            setPhotoURL(auth.currentUser["photoURL"] ? auth.currentUser.photoURL : "");
        }
        return () => isSubscribed = false;
    }, []);

    async function validateAndUpdate() {
        setUploading(true);
        let nameValidated = validateName(name);
        let emailValidated = validateEmail(email);
        let descriptionValidated = validateDescription(description);
        let responseMessage = '';
        setNameErrorMessage(nameValidated);
        setEmailErrorMessage(emailValidated);
        setDescriptionErrorMesssage(descriptionValidated);
        if (!(emailValidated || nameValidated || descriptionValidated)) {
            if (name != auth.currentUser.displayName) {
                let responseName = await changeName(auth.currentUser, name);
                responseMessage += responseName.success ? '' : responseName.message;
            }
            if (email != auth.currentUser.email) {
                let responseEmail = await changeEmail(auth.currentUser, email);
                responseMessage += responseEmail.success ? '' : responseEmail.message;
            }
            if (description != oldDescription && description) {
                let responseDescription = await changeDescription(auth.currentUser, description);
                responseMessage += responseDescription.success ? '' : responseDescription.message;
            }
        }
        if (photoURL != auth.currentUser.photoURL) {
            let responseDescription = await handleUserImagePicked(auth.currentUser, photoURL);
            responseMessage += responseDescription.success ? '' : responseDescription.message;
        }
        if (responseMessage.length > 0) {
            createOneButtonAlert('Error', 'You Brittaed it. ' + responseMessage, 'Try Again');
        } else {
            navigation.goBack();
        }
        setUploading(false);
    };

    return (
        <KeyboardAvoidingView alignItems="center" flex={1} justifyContent="center" mb={layout.height * 0.05}>
            <VStack space={layout.height * 0.01} mx={layout.width * 0.05} alignItems="center" my={layout.height * 0.05}>
                <UserAvatar photoURL={photoURL} action={() => setOpenModal(true)} width={layout.width * 0.351}>
                    <Center backgroundColor="primary.500" borderRadius="full"
                        position="absolute" bottom={0} right={0} w={layout.height * 0.05} h={layout.height * 0.05}>
                        <Icon color="white" as={Feather} name="edit-2" size={layout.height * 0.02} />
                    </Center>
                </UserAvatar>
                <FormControl isInvalid={nameErrorMessage}>
                    <Text color="muted.400">Name</Text>
                    <Input w={layout.width * 0.9} InputLeftElement={<Icon as={<Ionicons name="person-outline" size={layout.width * 0.025} color="muted.700" />}
                        size={5} ml="2" color="muted.400" />} placeholder={name}
                        value={name} onChangeText={name => setName(name)}
                        borderColor="muted.300" />
                    <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={layout.width * 0.025} color="red" />}>
                        {nameErrorMessage}
                    </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={emailErrorMessage}>
                    <Text color="muted.400">Email</Text>
                    <Input w={layout.width * 0.9} InputLeftElement={<Icon as={<Entypo name="email" size={layout.width * 0.025} color="muted.700" />}
                        size={5} ml="2" color="muted.400" />} placeholder={email}
                        value={email} onChangeText={email => setEmail(email)}
                        borderColor="muted.300" />
                    <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={layout.width * 0.025} color="red" />}>
                        {emailErrorMessage}
                    </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={descriptionErrorMessage}>
                    <Text color="muted.400">Description</Text>
                    <Input w={layout.width * 0.9} InputLeftElement={<Icon as={<Entypo name="list" size={layout.width * 0.025} color="muted.700" />}
                        size={5} ml="2" color="muted.400" />} placeholder={description}
                        value={description} onChangeText={desc => setDescription(desc)}
                        borderColor="muted.300" />
                    <FormControl.ErrorMessage leftIcon={<Ionicons name="ios-warning-outline" size={layout.width * 0.025} color="red" />}>
                        {descriptionErrorMessage}
                    </FormControl.ErrorMessage>
                </FormControl>
                {auth.emailVerified &&
                    <Box>
                        <VStack>
                            <Text>
                                It looks like your email is not verified.
                            </Text>
                            <Button w={layout.width * 0.9} onPress={() => {
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
                <Button w={layout.width * 0.9} variant="solid"
                    isLoading={uploading}
                    onPress={() => validateAndUpdate()}>
                    Update
                </Button>
            </VStack>
            <ChangePicModal setOpenModal={setOpenModal} openModal={openModal} setPhotoURL={setPhotoURL} />
        </KeyboardAvoidingView >
    );
}

export default EditProfile;