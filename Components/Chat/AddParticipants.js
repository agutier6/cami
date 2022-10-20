import React, { useEffect, useState } from 'react';
import { Box, VStack, FlatList, Spinner, Input, Fab, Icon, Center } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { getAuth } from 'firebase/auth';
import { compareTwoStrings } from 'string-similarity';
import FriendEntry from './../User/FriendEntry';
import { getFriendsAsync, getFriendsDataAsync } from '../../services/friends';
import UserAvatar from '../User/UserAvatar';
import { AntDesign, Entypo } from '@expo/vector-icons';

const AddParticipants = ({ navigation }) => {
    const [searchFriends, setSearchFriends] = useState(null);
    const [friends, setFriends] = useState(null);
    const [friendsData, setFriendsData] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const layout = useWindowDimensions();
    const auth = getAuth();

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            setFriends(null);
            setSearchFriends(null);
            setFriendsData([]);
            setSelectedFriends([]);
            async function getFriends() {
                if (isSubscribed) {
                    setFriends(await getFriendsAsync('accepted', auth.currentUser.uid));
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
                if (rating > 0.3) {
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

    function handleSelect(id) {
        let temp = friendsData.get(id);
        if (temp["selected"] === true) {
            setSelectedFriends(selectedFriends.filter(friend => friend.id != temp.id))
        } else {
            setSelectedFriends(selectedFriends.concat([{ ...temp, selected: true }]));
        }
        friendsData.set(id, {
            ...temp,
            selected: !temp.selected
        });
        if (searchFriends) {
            searchFriends.set(id, {
                ...temp,
                selected: !temp.selected
            });
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
        <>
            <Box alignItems="center">
                <VStack w={layout.width}>
                    <Input placeholder="Search" w={layout.width} onChangeText={(input) => handleSearch(input)} autoCapitalize='none' />
                    {selectedFriends.length > 0 &&
                        <FlatList h={layout.height * 0.1} horizontal keyboardShouldPersistTaps='handled' data={selectedFriends}
                            renderItem={({ item }) => {
                                return (
                                    <UserAvatar photoURL={item.photoURL} text={item.displayName} action={() => handleSelect(item.id)} mx={layout.width * 0.025} h={layout.height * 0.1} width={layout.height * 0.06}>
                                        <Center backgroundColor="gray.300" borderRadius="full"
                                            position="absolute" bottom={0} right={0} w={layout.height * 0.0225} h={layout.height * 0.0225}>
                                            <Icon color="gray.500" as={Entypo} name="cross" size={layout.height * 0.015} />
                                        </Center>
                                    </UserAvatar>)
                            }}
                            keyExtractor={(item, index) => item.id}
                            borderBottomWidth="1" _dark={{
                                borderColor: "muted.50"
                            }} borderColor="muted.200" />}
                    <FlatList keyboardShouldPersistTaps='handled' data={searchFriends ? Array.from(searchFriends.values()).sort((a, b) => {
                        if (a.rating < b.rating) {
                            return 1;
                        } else if (a.rating > b.rating) {
                            return -1;
                        }
                        return 0;
                    }) : Array.from(friendsData.values())}
                        renderItem={({ item }) => {
                            return <FriendEntry userData={item} action={() => handleSelect(item.id)}>
                                <Center backgroundColor="primary.500" borderRadius="full"
                                    position="absolute" bottom={0} right={0} w={layout.height * 0.0225} h={layout.height * 0.0225}>
                                    <Icon color="white" as={Entypo} name="check" size={layout.height * 0.015} />
                                </Center>
                            </FriendEntry>
                        }}
                        keyExtractor={(item, index) => item.id} />
                </VStack>
            </Box>
            <Fab renderInPortal={false}
                shadow={2} size="sm"
                bottom={layout.height * 0.025}
                icon={<Icon color="white" as={AntDesign} name="arrowright" size="sm" />}
                onPress={() => {
                    navigation.push("Add Subject", { groupParticipants: selectedFriends });
                }} />
        </>
    );
}

export default AddParticipants