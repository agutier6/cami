import { Box, Avatar, Text, HStack, VStack, Spinner, Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import { useWindowDimensions } from 'react-native';
import { sendFriendRequest, acceptFriendRequest, deleteFriend } from '../../services/friendRequest';
import { getAuth } from 'firebase/auth';

const UserProfile = ({ route, navigation }) => {
    const firestore = getFirestore();
    const [userData, setUserData] = useState(null);
    const [friendStatus, setFriendStatus] = useState(null);
    const layout = useWindowDimensions();
    const auth = getAuth().currentUser.uid;

    const { userId, username } = route.params;

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            async function getUser() {
                const user = await getDoc(doc(firestore, "users", userId));
                if (user.exists()) {
                    setUserData(user.data());
                }
            }
            onSnapshot(doc(firestore, `users/${auth}/friends`, userId), (doc) => {
                console.log("Current data: ", doc.data());
                if (doc.exists()) {
                    setFriendStatus(doc.data().status);
                } else {
                    setFriendStatus('empty');
                }
            });
            navigation.setOptions({ headerTitle: username });
            getUser();
        }
        return () => isSubscribed = false;
    }, [])

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
                        <Button onPress={() => sendFriendRequest(auth, userId)}>
                            Add Friend
                        </Button>}
                    {friendStatus === 'received' &&
                        <Button onPress={() => acceptFriendRequest(userId, auth)}>
                            Accept friend request
                        </Button>}
                    {friendStatus === 'sent' &&
                        <Button onPress={() => deleteFriend(auth, userId)}>
                            Cancel friend request
                        </Button>}
                    {friendStatus === 'accepted' &&
                        <Button>
                            Friends
                        </Button>}
                </VStack>
            </VStack>
        </Box >
    )
}

export default UserProfile