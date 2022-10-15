import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, FlatList, Avatar, Text, Pressable, Spacer, Spinner, Button } from 'native-base';
import { collection, query, where, getFirestore, getDocs, onSnapshot } from "firebase/firestore";
import { useWindowDimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { acceptFriendRequest, rejectFriendRequest, selectAcceptRequestStatus, selectRejectRequestStatus, clearFriendDetails } from './userSlice';
import { useDispatch, useSelector } from 'react-redux';

const FriendsRequestsList = ({ navigation }) => {
    const firestore = getFirestore();
    const [friends, setFriends] = useState(null);
    const [friendsData, setFriendsData] = useState([]);
    const layout = useWindowDimensions();
    const auth = getAuth();
    const isFocused = useIsFocused()
    const dispatch = useDispatch();
    const acceptRequestStatus = useSelector(selectAcceptRequestStatus);
    const rejectRequestStatus = useSelector(selectRejectRequestStatus);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            setFriends(null);
            setFriendsData([]);
            dispatch(clearFriendDetails());
            async function getFriends() {
                const friendsQuery = query(collection(firestore, `users/${auth.currentUser.uid}/friends`), where('status', '==', 'received'))
                const querySnapshot = await getDocs(friendsQuery);
                if (isSubscribed) {
                    setFriends(querySnapshot.docs.map(doc => doc.id));
                }
            }
            getFriends();
        }

        return () => {
            isSubscribed = false;
            dispatch(clearFriendDetails());
        };
    }, [isFocused]);

    useEffect(() => {
        let isSubscribed = true;
        if (friends && isSubscribed) {
            async function getFriendsData() {
                for (let i = 0; i < friends.length; i += 10) {
                    let array = friends.slice(i, Math.max(friends.length, i + 10));
                    if (array.length > 0) {
                        const friendsDataQuery = query(collection(firestore, 'users'), where('__name__', 'in', array))
                        const querySnapshot = await getDocs(friendsDataQuery);
                        if (isSubscribed) {
                            setFriendsData(
                                friendsData.concat(querySnapshot.docs.map(doc => ({
                                    id: doc.id,
                                    username: doc.data().username,
                                    displayName: doc.data().displayName,
                                    photoURL: doc.data().photoURL
                                })))
                            );
                        }
                    }
                }
            }
            getFriendsData();
        }
        return () => isSubscribed = false;
    }, [friends])

    if (!friends) {
        return (
            <Box flex={1} alignItems="center" justifyContent="center">
                <Spinner size="lg" />
            </Box>
        );
    }
    return (
        <Box alignItems="center">
            <VStack w={layout.width}>
                <FlatList keyboardShouldPersistTaps='handled' data={friendsData} renderItem={({
                    item
                }) => <Box borderBottomWidth="1" _dark={{
                    borderColor: "muted.50"
                }} borderColor="muted.200" py="2"
                    mx={layout.width * 0.025}>
                        <HStack>
                            <Pressable onPress={() => navigation.navigate("User Profile", { userId: item.id })}>
                                <HStack space={[2, 3]} justifyContent="space-between" >
                                    <Avatar size="48px" source={{
                                        uri: item.photoURL
                                    }} />
                                    <VStack>
                                        <Text _dark={{
                                            color: "warmGray.50"
                                        }} color="coolGray.800" bold>
                                            {item.username}
                                        </Text>
                                        <Text color="coolGray.600" _dark={{
                                            color: "warmGray.200"
                                        }}>
                                            {item.displayName}
                                        </Text>
                                    </VStack>
                                    <Spacer />
                                </HStack>
                            </Pressable>
                            <Spacer />
                            <HStack w={layout.width * 0.41}>
                                <Button w={layout.width * 0.2} h={layout.height * 0.05}
                                    isLoading={(acceptRequestStatus === 'loading' || rejectRequestStatus === 'loading')}
                                    onPress={() => {
                                        dispatch(acceptFriendRequest({ sender: item.id, recipient: auth.currentUser.uid }));
                                        setFriends(friends.filter(friend => friend != item.id));
                                    }}>
                                    Accept
                                </Button>
                                <Spacer />
                                <Button w={layout.width * 0.2} h={layout.height * 0.05} variant='outline'
                                    isLoading={(acceptRequestStatus === 'loading' || rejectRequestStatus === 'loading')}
                                    onPress={() => {
                                        dispatch(rejectFriendRequest({ sender: item.id, recipient: auth.currentUser.uid }));
                                        setFriends(friends.filter(friend => friend != item.id));
                                    }}>
                                    Reject
                                </Button>
                            </HStack>
                        </HStack>
                    </Box>} keyExtractor={item => item.id} />
            </VStack>
        </Box>
    );
}

export default FriendsRequestsList