import React, { useEffect } from 'react';
import { Box, VStack, FlatList, Spinner } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { clearFriendDetails, clearRequestDetails, selectGetFriendsStatus, selectFriends, getFriends } from './userSlice';
import { useDispatch, useSelector } from 'react-redux';
import FriendRequest from './FriendRequest';

const FriendsRequestsList = ({ navigation }) => {
    const layout = useWindowDimensions();
    const auth = getAuth();
    const isFocused = useIsFocused()
    const dispatch = useDispatch();
    const getFriendsStatus = useSelector(selectGetFriendsStatus);
    const friends = useSelector(selectFriends);

    useEffect(() => {
        let isSubscribed = true;
        if (isFocused && isSubscribed) {
            dispatch(clearFriendDetails());
            dispatch(clearRequestDetails())
        }
        return () => isSubscribed = false;
    }, [isFocused]);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            if (getFriendsStatus === 'idle' && isFocused) {
                dispatch(getFriends({ status: 'received', userId: auth.currentUser.uid }))
            }
        }
        return () => isSubscribed = false;
    }, [dispatch, getFriendsStatus]);

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
                <FlatList keyboardShouldPersistTaps='handled' data={friends} renderItem={({ item }) => <FriendRequest userId={item} />} keyExtractor={(item, index) => index.toString()} />
            </VStack>
        </Box>
    );
}

export default FriendsRequestsList