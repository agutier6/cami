import { Box, Heading, Center, VStack, Text, Spinner, Input, Icon, HStack, Button, Pressable, Spacer, ScrollView, IconButton } from 'native-base'
import GroupIcon from '../Utils/GroupIcon'
import { useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getChatInfoAsync, getGroupParticipantsWithLimitAsync } from '../../services/chats'
import { getFriendsDataAsync } from '../../services/friends'
import FriendEntry from '../User/FriendEntry';
import ReadMore from '@fawazahmed/react-native-read-more';
import { getDateFromTimestamp } from '../../utils/date';
import { useSelector, useDispatch } from 'react-redux';
import { changeGroupPhoto, selectChangeGroupPhotoError, selectChangeGroupPhotoStatus, selectGroupDescription, selectGroupName, selectLeaveGroupChatError, selectLeaveGroupChatStatus, leaveGroupChat, selectDeleteChatStatus, selectDeleteChatError, deleteChat } from './chatSlice'
import { Feather, Ionicons } from '@expo/vector-icons'
import ChangePicModal from '../Utils/ChangePicModal'
import { createOneButtonActionAlert, createOneButtonAlert } from '../Alerts/OneButtonPopUp'
import { getAuth } from 'firebase/auth'
import ParticipantActionModal from './ParticipantActionModal'

const GROUP_PARTICIPANTS_LIMIT = 10;

const ChatInfo = ({ route, navigation }) => {
    const layout = useWindowDimensions()
    const [groupParticipants, setGroupParticipants] = useState(null);
    const [groupParticipantsData, setGroupParticipantsData] = useState(new Map());
    const [chatInfo, setChatInfo] = useState(null);
    const groupDescription = useSelector(selectGroupDescription);
    const groupName = useSelector(selectGroupName);
    const [photoURL, setPhotoUrl] = useState(route ? route.params["photoURL"] : null);
    const [changePicModalOpen, setChangePicModalOpen] = useState(false);
    const [participantActionModalOpen, setParticipantActionModalOpen] = useState(false);
    const dispatch = useDispatch();
    const changeGroupPhotoStatus = useSelector(selectChangeGroupPhotoStatus);
    const changeGroupPhotoError = useSelector(selectChangeGroupPhotoError);
    const [photoRequestId, setPhotoRequestId] = useState(null);
    const auth = getAuth();
    const leaveGroupChatStatus = useSelector(selectLeaveGroupChatStatus);
    const leaveGroupChatError = useSelector(selectLeaveGroupChatError);
    const [leaveRequestId, setLeaveRequestId] = useState(null);
    const [removeUserCount, setRemoveUserCount] = useState(0);
    const deleteChatStatus = useSelector(selectDeleteChatStatus);
    const deleteChatError = useSelector(selectDeleteChatError);
    const [deleteChatRequestId, setDeleteChatRequestId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedDisplayName, setSelectedDisplayName] = useState();

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            async function getGroupParticipantsAndChatInfo() {
                setChatInfo(await getChatInfoAsync(route.params["chatId"]))
                setGroupParticipants(await getGroupParticipantsWithLimitAsync(route.params["chatId"], GROUP_PARTICIPANTS_LIMIT));
            }
            getGroupParticipantsAndChatInfo();
        }
        return () => isSubscribed = false;
    }, [])

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed && chatInfo && photoURL != chatInfo["photoUrl"]) {
            let request = dispatch(changeGroupPhoto({ chatId: route.params["chatId"], photoURI: photoURL }));
            setPhotoRequestId(request["photoRequestId"]);
        }
        return () => isSubscribed = false;
    }, [photoURL])

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed && changeGroupPhotoStatus[photoRequestId] === 'succeeded') {
            setChatInfo({
                ...chatInfo,
                photoURL: photoURL
            })
        } else if (isSubscribed && changeGroupPhotoStatus[photoRequestId] === 'failed') {
            createOneButtonAlert('Error', changeGroupPhotoError[photoRequestId], 'Close')
        }
        return () => isSubscribed = false;
    }, [changeGroupPhotoStatus[photoRequestId]])

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed && leaveGroupChatStatus[leaveRequestId] === 'succeeded') {
            navigation.popToTop();
        } else if (isSubscribed && leaveGroupChatStatus[leaveRequestId] === 'failed') {
            createOneButtonAlert('Error', leaveGroupChatError[leaveRequestId], 'Close')
        }
        return () => isSubscribed = false;
    }, [leaveGroupChatStatus[leaveRequestId]])

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed && deleteChatStatus[deleteChatRequestId] === 'succeeded') {
            navigation.popToTop();
        } else if (isSubscribed && deleteChatStatus[deleteChatRequestId] === 'failed') {
            createOneButtonAlert('Error', deleteChatError[deleteChatRequestId], 'Close')
        }
        return () => isSubscribed = false;
    }, [deleteChatStatus[deleteChatRequestId]])

    async function getFriendsData() {
        setGroupParticipantsData(await getFriendsDataAsync(Object.keys(groupParticipants)));
    }

    useEffect(() => {
        let isSubscribed = true;
        if (groupParticipants && isSubscribed) {
            getFriendsData();
        }
        return () => isSubscribed = false;
    }, [groupParticipants]);

    return (
        <ScrollView>
            <VStack mx={layout.width * 0.05} mt={layout.height * 0.025} mb={layout.height * 0.01} space={layout.height * 0.02}>
                <Center>
                    <GroupIcon size={layout.height * 0.2} photoURL={photoURL} borderWidth={1} borderColor="muted.400" onPress={() => setChangePicModalOpen(true)} isDisabled={changeGroupPhotoStatus[photoRequestId] === 'loading'}>
                        <Center alignItems="center" justifyContent="center" backgroundColor="primary.500" borderRadius="full"
                            position="absolute" bottom={0} right={0} w={layout.height * 0.05} h={layout.height * 0.05}>
                            <Icon color="white" as={Feather} name="edit-2" size={layout.height * 0.02} />
                        </Center>
                    </GroupIcon>
                </Center>
                <VStack alignItems="center" space={layout.height * 0.005}>
                    <Pressable onPress={() => navigation.push("Group Name", {
                        chatId: route.params["chatId"],
                        name: groupName[route.params["chatId"]] ? groupName[route.params["chatId"]] : chatInfo ? chatInfo["name"] : route ? route.params["chatName"] : null
                    })}>
                        <HStack alignItems="center" space={layout.width * 0.01}>
                            <Heading>
                                {groupName[route.params["chatId"]] ? groupName[route.params["chatId"]] : chatInfo ? chatInfo["name"] : route ? route.params["chatName"] : null}
                            </Heading>
                            <Icon color="muted.400" as={Feather} name="edit" size={layout.height * 0.02} />
                        </HStack>
                    </Pressable>
                    <Text>
                        {chatInfo ? "Group · " + (chatInfo["numParticipants"] - removeUserCount) + " participants" : null}
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
                                seeLessStyle={{ color: 'deepskyblue' }}>
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
                        <HStack h={layout.height * 0.04} alignItems="center" mx={layout.width * 0.025}>
                            <Text position="absolute" left={0} color="muted.500" bold>
                                {chatInfo ? (chatInfo["numParticipants"] - removeUserCount) + " participants" : null}
                            </Text>
                            <IconButton position="absolute" right={0} onPress={() => navigation.push("Search Participants", { chatId: route.params["chatId"], autoFocus: true })}
                                icon={<Icon as={Ionicons} name="search" />} borderRadius="full" color="muted.500" />
                        </HStack>
                        {groupParticipants[auth.currentUser.uid] === 'admin' &&
                            <Pressable onPress={() => navigation.push('Add Participants', { chatId: route.params["chatId"] })}
                                borderBottomWidth="1" borderTopWidth={1} _dark={{
                                    borderColor: "muted.50"
                                }} borderColor="muted.200" py="2"
                                mx={layout.width * 0.025} w={layout.width * 0.95}>
                                <HStack space={[2, 3]} alignItems="center">
                                    <Center size={layout.height * 0.06} borderRadius="full" backgroundColor="gray.300">
                                        <Icon color="gray.400" as={Feather} name="user-plus" size={layout.height * 0.03} />
                                    </Center>
                                    <Text color="coolGray.600" _dark={{
                                        color: "warmGray.200"
                                    }}>
                                        Add group participants
                                    </Text>
                                    <Spacer />
                                </HStack>
                            </Pressable>}
                        {Array.from(groupParticipantsData.values()).map(item =>
                            <FriendEntry userData={item} isAdmin={groupParticipants[item.id] === 'admin'} action={() => {
                                setSelectedDisplayName(item["displayName"]);
                                setSelectedUserId(item["id"]);
                                setParticipantActionModalOpen(true);
                            }} key={item.id} />
                        )}
                        {chatInfo && chatInfo["numParticipants"] > GROUP_PARTICIPANTS_LIMIT && <Pressable onPress={() => navigation.push("Search Participants", { chatId: route.params["chatId"] })}
                            borderBottomWidth="1" borderTopWidth={1} _dark={{
                                borderColor: "muted.50"
                            }} borderColor="muted.200" py="2"
                            mx={layout.width * 0.025} w={layout.width * 0.95}>
                            <HStack alignItems="center" h={layout.height * 0.06}>
                                <Text mx={layout.width * 0.025} color="primary.600" _dark={{
                                    color: "primary.200"
                                }}>
                                    View All ({chatInfo["numParticipants"] - GROUP_PARTICIPANTS_LIMIT} more)
                                </Text>
                                <Spacer />
                            </HStack>
                        </Pressable>}
                    </VStack>
                </Box>}
                <Button variant="outline" colorScheme="warning"
                    isLoading={leaveGroupChatStatus[leaveRequestId] === 'loading'}
                    onPress={() => createOneButtonActionAlert("Leave Group", "Do you really want to leave this group?", "Yes", "No", () => {
                        let request = dispatch(leaveGroupChat({ chatId: route.params["chatId"], userId: auth.currentUser.uid }));
                        setLeaveRequestId(request["requestId"]);
                    })}>
                    Leave Group
                </Button>
                {groupParticipants && groupParticipants[auth.currentUser.uid] === 'admin' &&
                    <Button variant="subtle" colorScheme="danger"
                        isLoading={deleteChatStatus[deleteChatRequestId] === 'loading'}
                        onPress={() => createOneButtonActionAlert("Delete Group", "Do you really want to delete this group?\nThis action cannot be undone.", "Yes", "No", () => {
                            let request = dispatch(deleteChat({ chatId: route.params["chatId"] }));
                            setDeleteChatRequestId(request["requestId"]);
                        })}>
                        Delete Group
                    </Button>}
                {!groupParticipants &&
                    <Box alignItems="center" justifyContent="center" h={layout.height * 0.3}>
                        <Spinner size="lg" />
                    </Box>}
            </VStack>
            <ChangePicModal setOpenModal={setChangePicModalOpen} openModal={changePicModalOpen} setPhotoURL={setPhotoUrl} />
            <ParticipantActionModal setOpenModal={setParticipantActionModalOpen} openModal={participantActionModalOpen}
                userId={selectedUserId} displayName={selectedDisplayName}
                isAdmin={groupParticipants && groupParticipants[auth.currentUser.uid] === 'admin'}
                chatId={route.params["chatId"]} removeAction={() => {
                    if (groupParticipants && Object.keys(groupParticipants).find(key => key === selectedUserId)) {
                        let groupParticipantsTemp = groupParticipants;
                        delete groupParticipantsTemp[selectedUserId];
                        setGroupParticipants(groupParticipantsTemp);
                        getFriendsData();
                    }
                    setRemoveUserCount(removeUserCount + 1)
                }} />
        </ ScrollView>
    )
}

export default ChatInfo