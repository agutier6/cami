import React, { useState, useEffect } from 'react';
import { Box, Input, VStack, HStack, FlatList, Avatar, Text, Pressable, Spacer, Spinner } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { compareTwoStrings } from 'string-similarity';
import { clearFriendDetails, selectGetFriendsStatus, selectGetFriendsDataStatus, getFriendsData, selectFriendsData, getFriends, clearFriendData } from './userSlice';
import { useDispatch, useSelector } from 'react-redux';

const FriendsList = ({ route, navigation }) => {
    const [searchFriends, setSearchFriends] = useState(null);
    const layout = useWindowDimensions();
    const auth = getAuth();
    const dispatch = useDispatch();
    const isFocused = useIsFocused()
    const getFriendsStatus = useSelector(selectGetFriendsStatus);
    const getFriendsDataStatus = useSelector(selectGetFriendsDataStatus);
    const friendsData = useSelector(selectFriendsData);

    useEffect(() => {
        let isSubscribed = true;
        if (isFocused) {
            dispatch(clearFriendData());
            dispatch(clearFriendDetails());
        }
        return () => isSubscribed = false;
    }, [isFocused]);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            if (getFriendsStatus === 'idle' && isFocused) {
                dispatch(getFriends({ status: 'accepted', userId: route ? route.params.userId : auth.currentUser.uid }))
            }
        }
        return () => isSubscribed = false;
    }, [dispatch, getFriendsStatus]);

    useEffect(() => {
        let isSubscribed = true;
        if (getFriendsStatus === 'succeeded' && getFriendsDataStatus === 'idle' && isSubscribed && isFocused) {
            dispatch(getFriendsData())
        }
        return () => isSubscribed = false;
    }, [dispatch, getFriendsStatus])

    function handleSearch(input) {
        if (input.length > 0) {
            setSearchFriends(friendsData.filter(friend => {
                let rating = compareTwoStrings(friend.username.toLowerCase(), input.toLowerCase()) + compareTwoStrings(friend.displayName.toLowerCase(), input.toLowerCase());
                if (rating > 0.3) {
                    return {
                        ...friend,
                        rating: rating
                    }
                }
            }).sort((a, b) => {
                if (a.rating < b.rating) {
                    return 1;
                } else if (a.rating > b.rating) {
                    return -1;
                }
                return 0;
            }))
        } else {
            setSearchFriends(null);
        }
        console.log(searchFriends);
    }

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
                <Input placeholder="Search" w={layout.width} onChangeText={(input) => handleSearch(input)} autoCapitalize='none' />
                <FlatList keyboardShouldPersistTaps='handled' data={searchFriends ? searchFriends : friendsData} renderItem={({
                    item
                }) => <Pressable onPress={() => navigation.navigate("User Profile", { userId: item.id })}
                    borderBottomWidth="1" _dark={{
                        borderColor: "muted.50"
                    }} borderColor="muted.200" pl={["0", "4"]} pr={["0", "5"]} py="2">
                        <HStack space={[2, 3]} justifyContent="space-between" mx={layout.width * 0.05}>
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
                    </Pressable>} keyExtractor={item => item.id} />
            </VStack>
        </Box>
    );
}

export default FriendsList