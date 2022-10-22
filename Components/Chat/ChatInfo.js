import { Box, Heading, Center, VStack, Text, FlatList, Spinner, Input, Icon } from 'native-base'
import GroupIcon from '../Utils/GroupIcon'
import { Pressable, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getChatInfoAsync, getGroupParticipantsAsync } from '../../services/chats'
import { getFriendsDataAsync } from '../../services/friends'
import { handleUserSearch } from '../../utils/search';
import FriendEntry from '../User/FriendEntry';
import ReadMore from '@fawazahmed/react-native-read-more';
import { getDateFromTimestamp } from '../../utils/date';
import { useSelector, useDispatch } from 'react-redux';
import { changeGroupPhoto, selectChangeGroupPhotoError, selectChangeGroupPhotoStatus, selectGroupDescription } from './chatSlice'
import { Feather } from '@expo/vector-icons'
import ChangePicModal from '../Utils/ChangePicModal'

const ChatInfo = ({ route, navigation }) => {
    const layout = useWindowDimensions()
    const [groupParticipants, setGroupParticipants] = useState(null);
    const [groupParticipantsData, setGroupParticipantsData] = useState(new Map());
    const [searchParticipants, setSearchParticipants] = useState(null);
    const [chatInfo, setChatInfo] = useState(null);
    const groupDescription = useSelector(selectGroupDescription);
    const [photoURL, setPhotoUrl] = useState(route ? route.params["photoURL"] : null);
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const changeGroupPhotoStatus = useSelector(selectChangeGroupPhotoStatus);
    const changeGroupPhotoError = useSelector(selectChangeGroupPhotoError);
    const [requestId, setRequestId] = useState(null);

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
        if (isSubscribed && chatInfo && photoURL != chatInfo["photoUrl"]) {
            let request = dispatch(changeGroupPhoto({ chatId: route.params["chatId"], photoURI: photoURL }));
            setRequestId(request["requestId"]);
        }
    }, [photoURL])

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed && changeGroupPhotoStatus[requestId] === 'succeeded') {
            setChatInfo({
                ...chatInfo,
                photoURL: photoURL
            })
        }
    }, [changeGroupPhotoStatus[requestId]])

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
        <>
            <VStack mx={layout.width * 0.05} mt={layout.height * 0.025} mb={layout.height * 0.01} space={layout.height * 0.02}>
                <Center>
                    <GroupIcon size={layout.height * 0.2} photoURL={photoURL} borderWidth={1} borderColor="muted.400" onPress={() => setOpenModal(true)} isDisabled={changeGroupPhotoStatus[requestId] === 'loading'}>
                        <Center alignItems="center" justifyContent="center" backgroundColor="primary.500" borderRadius="full"
                            position="absolute" bottom={0} right={0} w={layout.height * 0.05} h={layout.height * 0.05}>
                            <Icon color="white" as={Feather} name="edit-2" size={layout.height * 0.02} />
                        </Center>
                    </GroupIcon>
                </Center>
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
                        <Pressable onPress={() => navigation.push("Group Description", {
                            chatId: route.params["chatId"],
                            description: chatInfo["description"]
                        })}>
                            <ReadMore
                                numberOfLines={4}
                                style={{ color: 'dimgrey' }}
                                seeMoreText='Read more'
                                seeMoreStyle={{ color: 'deepskyblue' }}
                                seeLessText='Read less'
                                seeLessStyle={{ color: 'deepskyblue' }}
                                onExpand={() => sheetRef.current.snapTo(0)}>
                                {groupDescription[route.params["chatId"]] ? groupDescription[route.params["chatId"]] : chatInfo["description"] ? chatInfo["description"] : "Add group description"}
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
            <ChangePicModal setOpenModal={setOpenModal} openModal={openModal} setPhotoURL={setPhotoUrl} />
        </>
    )
}

export default ChatInfo