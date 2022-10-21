import React, { useEffect, useState, useLayoutEffect } from 'react';
import { AntDesignHeaderButtons } from '../Navigation/MyHeaderButtons.js';
import { Item } from 'react-navigation-header-buttons';
import { Fab, Icon, useToast, Box, VStack, FlatList, Spinner, Input } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getChatData, selectChatData, selectGetChatsStatus } from './chatSlice.js';
import { getAuth } from 'firebase/auth';
import { collection, orderBy, query, onSnapshot, getFirestore } from 'firebase/firestore';
import ChatEntry from './ChatEntry.js';
import { compareTwoStrings } from 'string-similarity';

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

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <AntDesignHeaderButtons>
                    <Item title="friend-requests" iconName="adduser" onPress={() => navigation.navigate("Friend Requests")} />
                </AntDesignHeaderButtons>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(firestore, `users/${auth.currentUser.uid}/groupChats`), orderBy('lastModified', 'desc')), querySnapshot => {
            setChats(querySnapshot.docs.map(doc => doc.id))
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed && chats && chats.length > 0) {
            let newChats = [];
            chats.forEach(chat => {
                if (chatData[chat]) { } else {
                    newChats.push(chat);
                }
            })
            if (newChats.length > 0) {
                let request = dispatch(getChatData({ chats: newChats }));
                setRequestId(request["requestId"]);
            }
        }
        return () => isSubscribed = false;
    }, [chats])

    if (chatData.size === 0) {
        return (
            <Box flex={1} alignItems="center" justifyContent="center">
                <Spinner size="lg" />
            </Box>
        );
    }

    function handleSearch(input) {
        if (input.length > 0) {
            let search = [];
            chats.forEach(chat => {
                if (chatData[chat]) {
                    let rating = compareTwoStrings(chatData[chat]["name"].toLowerCase(), input.toLowerCase())
                    if (rating > 0.3) {
                        search.push({
                            id: chat,
                            rating: rating
                        })
                    }
                }
            })
            setSearchChats(search.sort((a, b) => {
                if (a.rating < b.rating) {
                    return 1;
                } else if (a.rating > b.rating) {
                    return -1;
                }
                return 0;
            }).map(entry => entry.id));
        } else {
            setSearchChats(null);
        }
    }

    return (
        <>
            <Box alignItems="center">
                <VStack w={layout.width}>
                    <Input placeholder="Search" w={layout.width} onChangeText={(input) => handleSearch(input)} autoCapitalize='none' />
                    <FlatList keyboardShouldPersistTaps='handled' data={searchChats ? searchChats : chats}
                        renderItem={({ item }) => <ChatEntry chatData={chatData[item]} action={() => navigation.push("Group Chat", { chatId: item, chatName: chatData[item]["name"], photoURL: chatData[item]["photoURL"] })} />}
                        keyExtractor={(item, index) => item} />
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