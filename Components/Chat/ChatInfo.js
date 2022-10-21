import { Box, Heading, HStack, VStack, Text, FlatList, Spinner, Input } from 'native-base'
import GroupIcon from '../Utils/GroupIcon'
import { Pressable, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getChatInfoAsync, getGroupParticipantsAsync } from '../../services/chats'
import { getFriendsDataAsync } from '../../services/friends'
import { handleUserSearch } from '../../utils/search';
import FriendEntry from '../User/FriendEntry';
import ReadMore from '@fawazahmed/react-native-read-more';
import { getDateFromTimestamp } from '../../utils/date'

const ChatInfo = ({ route, navigation }) => {
    const layout = useWindowDimensions()
    const [groupParticipants, setGroupParticipants] = useState(null);
    const [groupParticipantsData, setGroupParticipantsData] = useState(new Map());
    const [searchParticipants, setSearchParticipants] = useState(null);
    const [chatInfo, setChatInfo] = useState(null);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            setGroupParticipants(null);
            setSearchParticipants(null);
            setGroupParticipantsData(new Map());
            setChatInfo(null);
            async function getGroupParticipantsAndChatInfo() {
                setGroupParticipants(await getGroupParticipantsAsync(route.params["chatId"]));
                setChatInfo(await getChatInfoAsync(route.params["chatId"]))
            }
            getGroupParticipantsAndChatInfo();
        }
    }, [])

    useEffect(() => {
        let isSubscribed = true;
        if (groupParticipants && isSubscribed) {
            async function getFriendsData() {
                setGroupParticipantsData(await getFriendsDataAsync(groupParticipants));
            }
            getFriendsData();
        }
        return () => isSubscribed = false;
    }, [groupParticipants]);

    return (
        <VStack mx={layout.width * 0.05} mt={layout.height * 0.025} mb={layout.height * 0.01} space={layout.height * 0.02}>
            <GroupIcon size={layout.height * 0.2} photoURL={route ? route.params["photoURL"] : null} borderWidth={1} borderColor="muted.400" />
            <VStack alignItems="center" space={layout.height * 0.005}>
                <Heading>
                    {route ? route.params["chatName"] : null}
                </Heading>
                <Text>
                    {groupParticipants ? "Group · " + groupParticipants.length + " participants" : null}
                </Text>
            </VStack>
            {chatInfo &&
                <VStack space={layout.height * 0.005}>
                    <Pressable>
                        <ReadMore
                            numberOfLines={4}
                            style={{ color: 'dimgrey' }}
                            seeMoreText='Read more'
                            seeMoreStyle={{ color: 'deepskyblue' }}
                            seeLessText='Read less'
                            seeLessStyle={{ color: 'deepskyblue' }}
                            onExpand={() => sheetRef.current.snapTo(0)}>
                            {chatInfo["description"] ? chatInfo["description"] : "Click to set group description"}
                        </ReadMore>
                    </Pressable>
                    {chatInfo["creatorName"] && chatInfo["creationTimestamp"] && <Text>
                        Created by {chatInfo["creatorName"]}, {getDateFromTimestamp(chatInfo["creationTimestamp"])}
                    </Text>}
                    {!chatInfo["creatorName"] && chatInfo["creationTimestamp"] && <Text>
                        Created on {getDateFromTimestamp(chatInfo["creationTimestamp"])}
                    </Text>}
                    {chatInfo["creatorName"] && !chatInfo["creationTimestamp"] && <Text>
                        Created by {chatInfo["creatorName"]}
                    </Text>}
                </VStack>}
            {groupParticipants && <Box alignItems="center">
                <VStack w={layout.width}>
                    <Input placeholder="Search" w={layout.width} onChangeText={(input) => handleUserSearch(input, setSearchParticipants, groupParticipantsData)} autoCapitalize='none' />
                    <FlatList keyboardShouldPersistTaps='handled' data={searchParticipants ? Array.from(searchParticipants.values()).sort((a, b) => {
                        if (a.rating < b.rating) {
                            return 1;
                        } else if (a.rating > b.rating) {
                            return -1;
                        }
                        return 0;
                    }) : Array.from(groupParticipantsData.values())}
                        renderItem={({ item }) => {
                            return <FriendEntry userData={item} action={() => navigation.push("User Profile", { userId: item.id })} />
                        }}
                        keyExtractor={(item, index) => item.id} />
                </VStack>
            </Box>}
            {!groupParticipants &&
                <Box flex={1} alignItems="center" justifyContent="center">
                    <Spinner size="lg" />
                </Box>}
        </VStack>
    )
}

export default ChatInfo