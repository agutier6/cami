import { Box, VStack, FlatList, Spinner, Input } from 'native-base'
import { useWindowDimensions, Keyboard } from 'react-native'
import React, { useEffect, useState, useLayoutEffect } from 'react'
import { getGroupParticipantsAsync } from '../../services/chats'
import { getFriendsDataAsync } from '../../services/friends'
import { handleUserSearch } from '../../utils/search';
import FriendEntry from '../User/FriendEntry';


const SearchGroupParticipants = ({ route, navigation }) => {
    const layout = useWindowDimensions()
    const [groupParticipants, setGroupParticipants] = useState(null);
    const [groupParticipantsData, setGroupParticipantsData] = useState(new Map());
    const [searchParticipants, setSearchParticipants] = useState(null);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            setGroupParticipants(null);
            setSearchParticipants(null);
            setGroupParticipantsData(new Map());
            async function getGroupParticipants() {
                setGroupParticipants(await getGroupParticipantsAsync(route.params["chatId"]));
            }
            getGroupParticipants();
        }
    }, [])

    useEffect(() => {
        let isSubscribed = true;
        if (groupParticipants && isSubscribed) {
            async function getFriendsData() {
                setGroupParticipantsData(await getFriendsDataAsync(Object.keys(groupParticipants)));
            }
            getFriendsData();
        }
        return () => isSubscribed = false;
    }, [groupParticipants]);

    return (
        <>
            {groupParticipants && <Box alignItems="center">
                <VStack w={layout.width}>
                    <Input placeholder="Search" w={layout.width} onChangeText={(input) => handleUserSearch(input, setSearchParticipants, groupParticipantsData)} autoCapitalize='none'
                        blurOnSubmit autoFocus={route.params["autoFocus"]} />
                    <FlatList keyboardShouldPersistTaps='handled' data={searchParticipants ? Array.from(searchParticipants.values()).sort((a, b) => {
                        if (a.rating < b.rating) {
                            return 1;
                        } else if (a.rating > b.rating) {
                            return -1;
                        }
                        return 0;
                    }) : Array.from(groupParticipantsData.values())}
                        renderItem={({ item }) => {
                            return <FriendEntry userData={item} isAdmin={groupParticipants[item.id] === 'admin'} action={() => navigation.push("User Profile", { userId: item.id })} />
                        }}
                        keyExtractor={(item, index) => item.id} />
                </VStack>
            </Box>}
            {!groupParticipants &&
                <Box alignItems="center" justifyContent="center" h={layout.height * 0.3}>
                    <Spinner size="lg" />
                </Box>}
        </>
    )
}

export default SearchGroupParticipants