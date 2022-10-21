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
// import { AntDesignHeaderButtons } from '../Navigation/MyHeaderButtons.js';
// import { Item } from 'react-navigation-header-buttons';

const GroupChat = ({ route, navigation }) => {
    const [messages, setMessages] = useState();
    const auth = getAuth();
    const firestore = getFirestore();

    useLayoutEffect(() => {
        let isSubscribed = true;
        if (isSubscribed && route["params"]) {
            navigation.setOptions({
                headerTitle: route.params["chatName"],
                // headerRight: () => (
                //     <AntDesignHeaderButtons>
                //         <Item title="user-menu" iconName="bars" onPress={() => signOut(auth)} />
                //     </AntDesignHeaderButtons>
                // )
            });
        }
        return () => isSubscribed = false;
    }, [navigation]);

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
        addDoc(collection(firestore, `groupChats/${route["params"]["chatId"]}/messages`), {
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
                _id: auth.currentUser.displayName,
                avatar: auth.currentUser.photoURL
            }}
        />
    )
}

export default GroupChat