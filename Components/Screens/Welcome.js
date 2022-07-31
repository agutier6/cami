import React from 'react'
import { NativeBaseProvider, Button, VStack, KeyboardAvoidingView, Heading, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { createOneButtonAlert } from "../Alerts/OneButtonPopUp"


function Welcome() {
    const navigation = useNavigation();

    return (
        <NativeBaseProvider>
            <KeyboardAvoidingView alignItems="center" flex={1} justifyContent="center">
                <VStack space={4} w="100%" alignItems="center" safeAreaX="3">
                    <Heading>
                        Cami
                    </Heading>
                    <Text>
                        Tired of making plans? Let Cami make them for you!
                    </Text>
                    <Button w="100%" variant="outline" safeAreaX="10"
                        onPress={() => navigation.navigate("Sign Up")}>
                        Sign Up
                    </Button>
                    <Button w="100%" variant="outline" safeAreaX="10"
                        onPress={() => navigation.navigate("Log In")}>
                        Log In
                    </Button>
                </VStack>
            </KeyboardAvoidingView>
        </NativeBaseProvider>
    )
}

export default Welcome