import React, { useEffect } from 'react';
import { Box, VStack, HStack, FlatList, Avatar, Text, Pressable, Spacer, Spinner, Button } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { acceptFriendRequest, rejectFriendRequest, selectAcceptRequestStatus, selectRejectRequestStatus, clearFriendDetails, selectGetFriendsStatus, selectGetFriendsDataStatus, getFriendsData, selectFriendsData, getFriends } from './userSlice';
import { useDispatch, useSelector } from 'react-redux';

const FriendsRequestsList = ({ navigation }) => {
    const layout = useWindowDimensions();
    const auth = getAuth();
    const isFocused = useIsFocused()
    const dispatch = useDispatch();
    const acceptRequestStatus = useSelector(selectAcceptRequestStatus);
    const rejectRequestStatus = useSelector(selectRejectRequestStatus);
    const getFriendsStatus = useSelector(selectGetFriendsStatus);
    const getFriendsDataStatus = useSelector(selectGetFriendsDataStatus);
    const friendsData = useSelector(selectFriendsData);

    useEffect(() => {
        let isSubscribed = true;
        if (isFocused && isSubscribed) {
            dispatch(clearFriendDetails());
        }
        return () => isSubscribed = false;
    }, [isFocused]);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            if (getFriendsStatus === 'idle' && acceptRequestStatus != 'loading' && rejectRequestStatus != 'loading' && isFocused) {
                dispatch(getFriends({ status: 'received', userId: auth.currentUser.uid }))
            }
        }
        return () => isSubscribed = false;
    }, [dispatch, acceptRequestStatus, rejectRequestStatus, getFriendsStatus]);

    useEffect(() => {
        let isSubscribed = true;
        if (getFriendsStatus === 'succeeded' && getFriendsDataStatus === 'idle' && acceptRequestStatus != 'loading' && rejectRequestStatus != 'loading' && isSubscribed && isFocused) {
            dispatch(getFriendsData())
        }
        return () => isSubscribed = false;
    }, [dispatch, getFriendsStatus])

    if (getFriendsDataStatus != 'succeeded') {
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
                            <Pressable onPress={() => navigation.push("User Profile", { userId: item.id })}>
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
                                        dispatch(clearFriendDetails());
                                    }}>
                                    Accept
                                </Button>
                                <Spacer />
                                <Button w={layout.width * 0.2} h={layout.height * 0.05} variant='outline'
                                    isLoading={(acceptRequestStatus === 'loading' || rejectRequestStatus === 'loading')}
                                    onPress={() => {
                                        dispatch(rejectFriendRequest({ sender: item.id, recipient: auth.currentUser.uid }));
                                        dispatch(clearFriendDetails());
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