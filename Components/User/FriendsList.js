import React, { useEffect, useState } from 'react';
import { Box, VStack, FlatList, Spinner, Input } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { getAuth } from 'firebase/auth';
import { compareTwoStrings } from 'string-similarity';
import FriendEntry from './FriendEntry';
import { getFriendsAsync, getFriendsDataAsync } from '../../services/friends';

const MIN_SEARCH_RATING = 0.3;

const FriendsList = ({ route, navigation }) => {
    const [searchFriends, setSearchFriends] = useState(null);
    const [friends, setFriends] = useState(null);
    const [friendsData, setFriendsData] = useState(new Map());
    const [userId] = useState(route ? route.params.userId : auth.currentUser.uid);
    const layout = useWindowDimensions();
    const auth = getAuth();

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            setFriends(null);
            setSearchFriends(null);
            setFriendsData(new Map());
            async function getFriends() {
                if (isSubscribed) {
                    setFriends(await getFriendsAsync('accepted', userId));
                }
            }
            getFriends();
        }
        return () => isSubscribed = false;
    }, []);

    useEffect(() => {
        let isSubscribed = true;
        if (friends && isSubscribed) {
            async function getFriendsData() {
                setFriendsData(await getFriendsDataAsync(friends));
            }
            getFriendsData();
        }
        return () => isSubscribed = false;
    }, [friends]);

    function handleSearch(input) {
        if (input.length > 0) {
            let searchMap = new Map();
            friendsData.forEach((value, key) => {
                let rating = compareTwoStrings(value.username.toLowerCase(), input.toLowerCase()) + compareTwoStrings(value.displayName.toLowerCase(), input.toLowerCase());
                if (rating > MIN_SEARCH_RATING) {
                    searchMap.set(key, {
                        ...value,
                        rating: rating
                    })
                }
            })
            setSearchFriends(searchMap);
        } else {
            setSearchFriends(null);
        }
    }

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
                <Input placeholder="Search" w={layout.width} onChangeText={(input) => handleSearch(input)} autoCapitalize='none' />
                {/* <FlatList keyboardShouldPersistTaps='handled' data={searchFriends ? searchFriends : Array.from(friendsData.values())}
                    renderItem={({ item }) => <FriendEntry userData={item} action={() => navigation.push("User Profile", { userId: item.id })} />}
                    keyExtractor={(item, index) => item.id} /> */}
                <FlatList keyboardShouldPersistTaps='handled' data={searchFriends ? Array.from(searchFriends.values()).sort((a, b) => {
                    if (a.rating < b.rating) {
                        return 1;
                    } else if (a.rating > b.rating) {
                        return -1;
                    }
                    return 0;
                }) : Array.from(friendsData.values())}
                    renderItem={({ item }) => {
                        return <FriendEntry userData={item} action={() => navigation.push("User Profile", { userId: item.id })} />
                    }}
                    keyExtractor={(item, index) => item.id} />
            </VStack>
        </Box>
    );
}

export default FriendsList