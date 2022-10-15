import React, { useState, useEffect } from 'react';
import { Box, Input, VStack, HStack, FlatList, Avatar, Text, Pressable, Spacer, Spinner } from 'native-base';
import { collection, query, where, getFirestore, getDocs } from "firebase/firestore";
import { useWindowDimensions } from 'react-native';
import { getAuth } from 'firebase/auth';
import { compareTwoStrings } from 'string-similarity';

const FriendsList = ({ route, navigation }) => {
    const [searchFriends, setSearchFriends] = useState(null);
    const firestore = getFirestore();
    const [friends, setFriends] = useState(null);
    const [friendsData, setFriendsData] = useState([]);
    const [userId] = useState(route ? route.params.userId : auth.currentUser.uid);
    const layout = useWindowDimensions();
    const auth = getAuth();

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            setFriends(null);
            setSearchFriends(null);
            setFriendsData([]);
            async function getFriends() {
                const friendsQuery = query(collection(firestore, `users/${userId}/friends`), where('status', '==', 'accepted'))
                const querySnapshot = await getDocs(friendsQuery);
                if (isSubscribed) {
                    setFriends(querySnapshot.docs.map(doc => doc.id));
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
    }, [friends]);

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
                <FlatList keyboardShouldPersistTaps='handled' data={searchFriends ? searchFriends : friendsData} renderItem={({
                    item
                }) => <Pressable onPress={() => navigation.push("User Profile", { userId: item.id })}
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