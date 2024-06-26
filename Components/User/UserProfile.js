import { Box, Text, HStack, VStack, Spinner, Button, Spacer, Pressable } from 'native-base';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useWindowDimensions } from 'react-native';
import { sendFriendRequest, acceptFriendRequest, deleteFriend, rejectFriendRequest, selectFriendRequestStatus, selectAcceptRequestStatus, selectRejectRequestStatus, selectDeleteFriendStatus, cancelFriendRequest, selectCancelFriendRequestStatus } from '../Friends/friendsSlice';
import { getAuth, signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { AntDesignHeaderButtons } from '../Navigation/MyHeaderButtons.js';
import { Item } from 'react-navigation-header-buttons';
import UserAvatar from './UserAvatar';

const UserProfile = ({ route, navigation }) => {
    const firestore = getFirestore();
    const [userData, setUserData] = useState(null);
    const [friendStatus, setFriendStatus] = useState(null);
    const layout = useWindowDimensions();
    const auth = getAuth();
    const dispatch = useDispatch();
    const friendRequestStatus = useSelector(selectFriendRequestStatus);
    const acceptRequestStatus = useSelector(selectAcceptRequestStatus);
    const rejectRequestStatus = useSelector(selectRejectRequestStatus);
    const deleteFriendStatus = useSelector(selectDeleteFriendStatus);
    const cancelRequestStatus = useSelector(selectCancelFriendRequestStatus);
    const [requestId, setRequestId] = useState(null);

    useLayoutEffect(() => {
        let isSubscribed = true;
        if (isSubscribed && (!route["params"] || (route["params"] ? route.params.userId : auth.currentUser.uid) === auth.currentUser.uid)) {
            navigation.setOptions({
                headerRight: () => (
                    <AntDesignHeaderButtons>
                        <Item title="user-menu" iconName="bars" onPress={() => signOut(auth)} />
                    </AntDesignHeaderButtons>
                )
            });
        }
        if (isSubscribed && userData) {
            navigation.setOptions({ headerTitle: userData["username"] });
        }
        return () => isSubscribed = false;
    }, [navigation, userData]);

    useEffect(() => {
        const unsubscribeUser = onSnapshot(doc(firestore, "users", route["params"] ? route.params.userId : auth.currentUser.uid), (user) => {
            if (user.exists()) {
                setUserData(user.data());
            }
        });
        const unsubscribeFriendStatus = onSnapshot(doc(firestore, `users/${auth.currentUser.uid}/friends`, route["params"] ? route.params.userId : auth.currentUser.uid), (doc) => {
            if (doc.exists()) {
                setFriendStatus(doc.data() ? doc.data().status : 'empty');
            } else {
                setFriendStatus('empty');
            }
        });
        return () => {
            unsubscribeUser();
            unsubscribeFriendStatus();
        };
    }, []);

    if (!userData) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center">
                <Spinner size="lg" />
            </Box>
        )
    }

    return (
        <Box>
            <VStack>
                <HStack mx={layout.width * 0.05} mt={layout.height * 0.025} mb={layout.height * 0.01} alignItems="center">
                    <UserAvatar photoURL={userData.photoURL} width={layout.width * 0.2} />
                    <Spacer />
                    <Pressable onPress={() => navigation.push("Friends", { userId: route["params"] ? route.params.userId : auth.currentUser.uid })}>
                        <VStack alignContent="center" alignItems="center">
                            <Text bold>{userData["numFriends"] ? userData.numFriends : 0}</Text>
                            <Text>Friends</Text>
                        </VStack>
                    </Pressable>
                    <Spacer />
                    <VStack alignContent="center" alignItems="center">
                        <Text bold>{userData["likedRestaurants"] ? userData.likedRestaurants : 0}</Text>
                        <Text>Restaurants</Text>
                    </VStack>
                </HStack>
                <VStack mx={layout.width * 0.05} space={layout.width * 0.025}>
                    <Text bold>
                        {userData.displayName}
                    </Text>
                    {(route["params"] ? route.params.userId : auth.currentUser.uid) === auth.currentUser.uid &&
                        <Button w={layout.width * 0.9} h={layout.height * 0.05} variant='outline'
                            onPress={() => navigation.navigate("Edit Profile", { desc: userData["description"] ? userData.description : "" })}>
                            Edit Profile
                        </Button>}
                    {friendStatus === 'empty' && (route["params"] ? route.params.userId : auth.currentUser.uid) != auth.currentUser.uid &&
                        <Button w={layout.width * 0.9} h={layout.height * 0.05}
                            isLoading={(friendRequestStatus[requestId] === 'loading' || acceptRequestStatus[requestId] === 'loading' || rejectRequestStatus[requestId] === 'loading' || deleteFriendStatus[requestId] === 'loading' || cancelRequestStatus[requestId] === 'loading')}
                            onPress={() => {
                                let request = dispatch(sendFriendRequest({ sender: auth.currentUser.uid, recipient: (route["params"] ? route.params.userId : auth.currentUser.uid) }));
                                setRequestId(request["requestId"]);
                            }}>
                            Add Friend
                        </Button>}
                    {friendStatus === 'received' && (route["params"] ? route.params.userId : auth.currentUser.uid) != auth.currentUser.uid &&
                        <HStack>
                            <Button w={layout.width * 0.43} h={layout.height * 0.05}
                                isLoading={(friendRequestStatus[requestId] === 'loading' || acceptRequestStatus[requestId] === 'loading' || rejectRequestStatus[requestId] === 'loading' || deleteFriendStatus[requestId] === 'loading' || cancelRequestStatus[requestId] === 'loading')}
                                onPress={() => {
                                    let request = dispatch(acceptFriendRequest({ sender: (route["params"] ? route.params.userId : auth.currentUser.uid), recipient: auth.currentUser.uid }));
                                    setRequestId(request["requestId"]);
                                }}>
                                Accept friend request
                            </Button>
                            <Spacer />
                            <Button w={layout.width * 0.43} h={layout.height * 0.05} variant='outline'
                                isLoading={(friendRequestStatus[requestId] === 'loading' || acceptRequestStatus[requestId] === 'loading' || rejectRequestStatus[requestId] === 'loading' || deleteFriendStatus[requestId] === 'loading' || cancelRequestStatus[requestId] === 'loading')}
                                onPress={() => {
                                    let request = dispatch(rejectFriendRequest({ sender: (route["params"] ? route.params.userId : auth.currentUser.uid), recipient: auth.currentUser.uid }));
                                    setRequestId(request["requestId"]);
                                }}>
                                Reject friend request
                            </Button>
                        </HStack>}
                    {friendStatus === 'sent' && (route["params"] ? route.params.userId : auth.currentUser.uid) != auth.currentUser.uid &&
                        <Button w={layout.width * 0.9} h={layout.height * 0.05} variant='outline'
                            isLoading={(friendRequestStatus[requestId] === 'loading' || acceptRequestStatus[requestId] === 'loading' || rejectRequestStatus[requestId] === 'loading' || deleteFriendStatus[requestId] === 'loading' || cancelRequestStatus[requestId] === 'loading')}
                            onPress={() => {
                                let request = dispatch(cancelFriendRequest({ sender: auth.currentUser.uid, recipient: (route["params"] ? route.params.userId : auth.currentUser.uid) }));
                                setRequestId(request["requestId"]);
                            }}>
                            Cancel friend request
                        </Button>}
                    {friendStatus === 'accepted' && (route["params"] ? route.params.userId : auth.currentUser.uid) != auth.currentUser.uid &&
                        <Button w={layout.width * 0.9} h={layout.height * 0.05} variant='outline'
                            isLoading={(friendRequestStatus[requestId] === 'loading' || acceptRequestStatus[requestId] === 'loading' || rejectRequestStatus[requestId] === 'loading' || deleteFriendStatus[requestId] === 'loading' || cancelRequestStatus[requestId] === 'loading')}
                            onPress={() => {
                                let request = dispatch(deleteFriend({ sender: auth.currentUser.uid, recipient: (route["params"] ? route.params.userId : auth.currentUser.uid) }));
                                setRequestId(request["requestId"]);
                            }}>
                            Unfriend
                        </Button>}
                </VStack>
            </VStack>
        </Box >
    )
}

export default UserProfile