import React from 'react'
import { Skeleton, Center, VStack, Box } from 'native-base'
import { Dimensions } from 'react-native';

export default function CardSkeleton() {
    return (
        <Box position="absolute">
            <Center w="100%">
                <VStack w="100%" maxW="400" borderWidth="1" space={8} overflow="hidden" rounded="2xl" _dark={{
                    borderColor: "coolGray.500"
                }} _light={{
                    borderColor: "coolGray.200"
                }}>
                    <Skeleton h={Dimensions.get('window').height * 0.5} />
                    <Skeleton.Text h={Dimensions.get('window').height * 0.2} px="4" />
                </VStack>
            </Center>
        </Box>
    )
}