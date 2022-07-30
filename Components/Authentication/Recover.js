import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { NativeBaseProvider, Input, Icon, VStack, Button, Box, FormControl } from 'native-base';

const Recover = () => {
    return (
        <NativeBaseProvider>
            <FormControl isRequired>
                <VStack space={4} w="100%" alignItems="center" safeArea="3">
                    <Box safeAreaX="10" safeAreaTop="10" safeAreaBottom="2">
                        We'll send you a recovery link if your email matches an account on our system.
                    </Box>
                    <Input w={{
                        base: "75%",
                        md: "25%"
                    }} InputLeftElement={<Icon as={<Entypo name="email" size={24} color="muted.700" />} size={5} ml="2" color="muted.700" />} placeholder="Email" />
                    <Button isLoading isLoadingText="Loading" size="md" variant="outline">
                        Recover
                    </Button>
                </VStack>
            </FormControl>
        </NativeBaseProvider >
    )
}

export default Recover;