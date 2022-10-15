import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
    getFirestore
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { AntDesignHeaderButtons } from '../Navigation/MyHeaderButtons.js';
import { Item } from 'react-navigation-header-buttons';

const ChatMain = ({ navigation }) => {
    const [messages, setMessages] = useState();
    const auth = getAuth();
    const firestore = getFirestore();

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
        const collectionRef = collection(firestore, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, querySnapshot => {
            setMessages(
                querySnapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user
                }))
            );
        });

        return () => unsubscribe();
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages)
        );
        const { _id, createdAt, text, user } = messages[0];
        addDoc(collection(firestore, 'chats'), {
            _id,
            createdAt,
            text,
            user
        });
    }, []);

    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.email,
                avatar: 'https://i.pravatar.cc/300'
            }}
        />
    )
}

export default ChatMain