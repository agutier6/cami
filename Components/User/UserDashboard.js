import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Input, Icon, VStack, Button, FormControl, KeyboardAvoidingView, Center, Image, Text } from 'native-base';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useAuthentication } from '../../utils/useAuthentication';

function UserDashboard() {
    const auth = getAuth();
    const [user] = useAuthentication();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [photoURL, setPhotoUrl] = useState();
    const [emailVerified, setEmailVerified] = useState();
    const [nameErrorMessage, setNameErrorMessage] = useState();
    const [emailErrorMessage, setEmailErrorMessage] = useState();

    useEffect(() => {
        if (user) {
            setName(user.displayName ? user.displayName : "");
            setEmail(user.email ? user.email : "");
            setPhotoUrl(user.photoURL ? user.photoURL : "");
            setEmailVerified(user.emailVerified ? user.emailVerified : false);
        }
    }, [user]);

    return (
        <NativeBaseProvider>
            <KeyboardAvoidingView alignItems="center" flex={1} justifyContent="center">
                <VStack space={4} w="100%" alignItems="center" safeArea="3">
                    <Center>
                        <Image size={150} alt="Profile Picture" borderRadius={100} source={{
                            uri: photoURL
                        }} fallbackSource={{
                            uri: "https://www.w3schools.com/css/img_lights.jpg"
                        }} />
                    </Center>
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
                    <Button w={{
                        base: "75%",
                        md: "25%"
                    }} variant="outline">
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
        </NativeBaseProvider>
    );
}

export default UserDashboard;