import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeBaseProvider, Input, Icon, VStack, Heading, Text, Link, Button, Box } from 'native-base';

const Login = () => {
    const navigation = useNavigation();
    const [show, setShow] = React.useState(false);
    return (
        <NativeBaseProvider>
            <VStack space={4} w="100%" alignItems="center" safeArea="3">
                <Input w={{
                    base: "75%",
                    md: "25%"
                }} InputLeftElement={<Icon as={<Ionicons name="person-outline" size={24} color="muted.700" />} size={5} ml="2" color="muted.700" />} placeholder="Username" />
                <Input w={{
                    base: "75%",
                    md: "25%"
                }} type={show ? "text" : "password"} InputRightElement={<Icon as={<Ionicons name={show ? "eye-outline" : "eye-off-outline"} />} size={5} mr="2" color="muted.700" onPress={() => setShow(!show)} />} placeholder="Password" />
                <Button isLoading isLoadingText="Loading" size="md" variant="outline">
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
        </NativeBaseProvider>
    )
}

export default Login;