import React, { useState, useEffect } from 'react'
import { Box, VStack, HStack, Avatar, Text, Pressable, Spacer, Button } from 'native-base';
import { acceptFriendRequest, rejectFriendRequest, selectAcceptRequestStatus, selectRejectRequestStatus } from './userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth } from 'firebase/auth';
import { useWindowDimensions } from 'react-native';
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';

export default function FriendRequest({ userId }) {
    const firestore = getFirestore();
    const dispatch = useDispatch();
    const auth = getAuth();
    const [userData, setUserData] = useState(null);
    const acceptRequestStatus = useSelector(selectAcceptRequestStatus);
    const rejectRequestStatus = useSelector(selectRejectRequestStatus);
    const layout = useWindowDimensions();
    const [requestId, setRequestId] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribeUser = onSnapshot(doc(firestore, "users", userId), (user) => {
            if (user.exists()) {
                setUserData(user.data());
            }
        });
        return () => unsubscribeUser();
    }, [])

    if (!userData || acceptRequestStatus[requestId] === 'succeeded' || rejectRequestStatus[requestId] === 'succeeded') {
        return <Box h={0}>
        </Box>
    }

    return (
        <Box borderBottomWidth="1" _dark={{
            borderColor: "muted.50"
        }} borderColor="muted.200" py="2"
            mx={layout.width * 0.025}>
            <HStack>
                <Pressable onPress={() => navigation.push("User Profile", { userId: userId })}>
                    <HStack space={[2, 3]} justifyContent="space-between" >
                        <Avatar size="48px" source={{
                            uri: userData.photoURL
                        }} />
                        <VStack>
                            <Text _dark={{
                                color: "warmGray.50"
                            }} color="coolGray.800" bold>
                                {userData.username}
                            </Text>
                            <Text color="coolGray.600" _dark={{
                                color: "warmGray.200"
                            }}>
                                {userData.displayName}
                            </Text>
                        </VStack>
                        <Spacer />
                    </HStack>
                </Pressable>
                <Spacer />
                <HStack w={layout.width * 0.41}>
                    <Button w={layout.width * 0.2} h={layout.height * 0.05}
                        isLoading={(acceptRequestStatus[requestId] === 'loading' || rejectRequestStatus[requestId] === 'loading')}
                        onPress={() => {
                            let request = dispatch(acceptFriendRequest({ sender: userId, recipient: auth.currentUser.uid }))
                            setRequestId(request["requestId"]);
                            console.log(acceptRequestStatus[requestId]);
                        }}>
                        Accept
                    </Button>
                    <Spacer />
                    <Button w={layout.width * 0.2} h={layout.height * 0.05} variant='outline'
                        isLoading={(acceptRequestStatus[requestId] === 'loading' || rejectRequestStatus[requestId] === 'loading')}
                        onPress={() => {
                            let request = dispatch(rejectFriendRequest({ sender: userId, recipient: auth.currentUser.uid }));
                            setRequestId(request["requestId"]);
                        }}>
                        Reject
                    </Button>
                </HStack>
            </HStack>
        </Box>
    )
}