import { Box, Avatar, Text, HStack, VStack, Spinner, Button, Spacer } from 'native-base';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import { useWindowDimensions } from 'react-native';
import { sendFriendRequest, acceptFriendRequest, deleteFriend, rejectFriendRequest, selectFriendRequestStatus, selectAcceptRequestError, selectAcceptRequestStatus, selectRejectRequestStatus, selectDeleteFriendStatus } from './userSlice';
import { getAuth } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';

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
    const [userId] = useState(route.params.userId);
    const [username] = useState(route.params.username);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            async function getUser() {
                const user = await getDoc(doc(firestore, "users", userId));
                if (user.exists()) {
                    setUserData(user.data());
                }
            }
            navigation.setOptions({ headerTitle: username });
            getUser();
        }
        return () => isSubscribed = false;
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(firestore, `users/${auth.currentUser.uid}/friends`, userId), (doc) => {
            if (doc.exists()) {
                setFriendStatus(doc.data() ? doc.data().status : 'empty');
            } else {
                setFriendStatus('empty');
            }
        });
        return () => unsubscribe();
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
                <HStack mx={layout.width * 0.025} mt={layout.height * 0.025} mb={layout.height * 0.01}>
                    <Avatar size="xl" source={{
                        uri: userData.photoURL
                    }} />
                </HStack>
                <VStack mx={layout.width * 0.05} space={layout.width * 0.025}>
                    <Text bold>
                        {userData.displayName}
                    </Text>
                    {friendStatus === 'empty' &&
                        <Button w={layout.width * 0.9} h={layout.height * 0.05}
                            isLoading={(friendRequestStatus === 'loading' || acceptRequestStatus === 'loading' || rejectRequestStatus === 'loading' || deleteFriendStatus === 'loading')}
                            onPress={() => dispatch(sendFriendRequest({ sender: auth.currentUser.uid, recipient: userId }))}>
                            Add Friend
                        </Button>}
                    {friendStatus === 'received' &&
                        <HStack>
                            <Button w={layout.width * 0.43} h={layout.height * 0.05}
                                isLoading={(friendRequestStatus === 'loading' || acceptRequestStatus === 'loading' || rejectRequestStatus === 'loading' || deleteFriendStatus === 'loading')}
                                onPress={() => dispatch(acceptFriendRequest({ sender: userId, recipient: auth.currentUser.uid }))}>
                                Accept friend request
                            </Button>
                            <Spacer />
                            <Button w={layout.width * 0.43} h={layout.height * 0.05} variant='outline'
                                isLoading={(friendRequestStatus === 'loading' || acceptRequestStatus === 'loading' || rejectRequestStatus === 'loading' || deleteFriendStatus === 'loading')}
                                onPress={() => dispatch(rejectFriendRequest({ sender: userId, recipient: auth.currentUser.uid }))}>
                                Reject friend request
                            </Button>
                        </HStack>}
                    {friendStatus === 'sent' &&
                        <Button w={layout.width * 0.9} h={layout.height * 0.05} variant='outline'
                            isLoading={(friendRequestStatus === 'loading' || acceptRequestStatus === 'loading' || rejectRequestStatus === 'loading' || deleteFriendStatus === 'loading')}
                            onPress={() => dispatch(deleteFriend({ sender: auth.currentUser.uid, recipient: userId }))}>
                            Cancel friend request
                        </Button>}
                    {friendStatus === 'accepted' &&
                        <Button w={layout.width * 0.9} h={layout.height * 0.05} variant='outline'
                            isLoading={(friendRequestStatus === 'loading' || acceptRequestStatus === 'loading' || rejectRequestStatus === 'loading' || deleteFriendStatus === 'loading')}
                            onPress={() => dispatch(deleteFriend({ sender: auth.currentUser.uid, recipient: userId }))}>
                            Unfriend
                        </Button>}
                </VStack>
            </VStack>
        </Box >
    )
}

export default UserProfile