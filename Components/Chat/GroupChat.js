import React, { useEffect, useCallback, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import {
    collection,
    orderBy,
    query,
    onSnapshot,
    getFirestore
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { sendGroupMessageAsync } from '../../services/messages';

const GroupChat = ({ route, navigation }) => {
    const [messages, setMessages] = useState();
    const auth = getAuth();
    const firestore = getFirestore();

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(firestore, `groupChats/${route["params"]["chatId"]}/messages`), orderBy('createdAt', 'desc')), querySnapshot => {
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
        sendGroupMessageAsync(route["params"]["chatId"], { _id, createdAt, text, user });
    }, []);

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth.currentUser.uid,
                name: auth.currentUser.displayName,
                avatar: auth.currentUser.photoURL
            }}
            renderUsernameOnMessage
        />
    )
}

export default GroupChat