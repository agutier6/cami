import React, { useEffect, useState } from 'react';
import { Fab, Icon, useToast, Box, VStack, FlatList, Spinner, Input } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearChatData, clearGroupInfo, getChatData, selectChatData, selectGetChatsStatus, selectGroupPhoto } from './chatSlice.js';
import { getAuth } from 'firebase/auth';
import { collection, orderBy, query, onSnapshot, getFirestore } from 'firebase/firestore';
import ChatEntry from './ChatEntry.js';
import { handleChatSearch } from '../../utils/search.js';

const ChatMain = ({ navigation }) => {
    const layout = useWindowDimensions();
    const toast = useToast();
    const dispatch = useDispatch()
    const chatData = useSelector(selectChatData)
    const getChatDataStatus = useSelector(selectGetChatsStatus);
    const auth = getAuth();
    const [chats, setChats] = useState([]);
    const [requestId, setRequestId] = useState();
    const firestore = getFirestore();
    const [searchChats, setSearchChats] = useState(null);
    const groupPhoto = useSelector(selectGroupPhoto);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            dispatch(clearChatData);
            dispatch(clearGroupInfo);
            setChats([])
        }
        const unsubscribe = onSnapshot(query(collection(firestore, `users/${auth.currentUser.uid}/groupChats`), orderBy('lastModified', 'desc')), querySnapshot => {
            setChats(querySnapshot.docs.map(doc => { return { id: doc.id, recentMessage: doc.data()["recentMessage"], lastModified: doc.data()["lastModified"] } }));
        });
        return () => {
            unsubscribe();
            isSubscribed = false;
        };
    }, []);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed && chats && chats.length > 0) {
            let newChats = [];
            chats.forEach(chat => {
                if (!chatData[chat.id]) {
                    newChats.push(chat.id);
                }
            })
            if (newChats.length > 0) {
                let request = dispatch(getChatData({ chats: newChats }));
                setRequestId(request["requestId"]);
            }
        }
        return () => isSubscribed = false;
    }, [chats, chatData])

    return (
        <>
            <Box alignItems="center">
                <VStack w={layout.width}>
                    <Input placeholder="Search" w={layout.width} onChangeText={(input) => handleChatSearch(input, setSearchChats, chatData, chats)} autoCapitalize='none' />
                    <FlatList keyboardShouldPersistTaps='handled' data={searchChats ? searchChats : chats} h="100%"
                        renderItem={({ item }) => <ChatEntry chatData={chatData[item.id]} photoURL={groupPhoto[item.id] ? groupPhoto[item.id] : chatData[item.id] ? chatData[item.id]["photoURL"] : null}
                            recentMessage={item["recentMessage"]}
                            lastModified={item["lastModified"]}
                            action={() => navigation.push("Group Chat", {
                                chatId: item.id,
                                chatName: chatData[item.id]["name"],
                                photoURL: chatData[item.id]["photoURL"]
                            })} />}
                        onRefresh={() => {
                            dispatch(clearChatData());
                            dispatch(clearGroupInfo());
                        }}
                        refreshing={Object.keys(chatData).length === 0}
                        keyExtractor={(item, index) => item.id} />
                </VStack>
            </Box>
            <Fab renderInPortal={false}
                shadow={2} size="sm"
                bottom={layout.height * 0.025}
                icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />}
                onPress={() => {
                    navigation.push("Add Participants");
                }} />
        </>
    )
}

export default ChatMain