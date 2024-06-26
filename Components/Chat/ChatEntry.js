import React from 'react'
import { Box, VStack, HStack, Text, Pressable, Spacer } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { getChatEntryDate } from '../../utils/date';
import GroupIcon from '../Utils/GroupIcon'

export default function ChatEntry({ name, selected, photoURL, action, recentMessage, recentSender, lastModified, children, ...props }) {
    const layout = useWindowDimensions();

    if (!name) {
        return <Box h={0}>
        </Box>
    }

    return (
        <Box borderBottomWidth="1" _dark={{
            borderColor: "muted.50"
        }} borderColor="muted.200" py="2"
            mx={layout.width * 0.025}
            {...props}>
            <Pressable w={layout.width * 0.95} onPress={() => {
                if (action) {
                    action();
                }
            }}>
                <HStack space={[2, 3]} justifyContent="space-between" >
                    <Box>
                        <GroupIcon size={layout.height * 0.06} photoURL={photoURL} />
                        {(selected === true) && children}
                    </Box>
                    <VStack w={layout.width * 0.95 - layout.height * 0.075}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text _dark={{
                                color: "warmGray.50"
                            }} color="coolGray.800" bold>
                                {name}
                            </Text>
                            {lastModified &&
                                <Text _dark={{
                                    color: "warmGray.50"
                                }} color="coolGray.800">
                                    {getChatEntryDate(lastModified)}
                                </Text>
                            }
                        </HStack>
                        {recentMessage && recentSender && <Text _dark={{
                            color: "warmGray.50"
                        }} color="coolGray.800">
                            {recentSender + ": " + recentMessage}
                        </Text>}
                    </VStack>
                    <Spacer />
                </HStack>
            </Pressable>
        </Box>
    )
}