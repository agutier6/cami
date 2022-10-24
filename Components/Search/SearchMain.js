import React, { useState, useEffect } from 'react';
import { Box, Input, VStack, FlatList } from 'native-base';
import { collection, query, where, getFirestore, getDocs, getDoc, doc } from "firebase/firestore";
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import UserEntry from '../User/UserEntry';

const MIN_SEARCH_INPUT_LENGTH = 3;

const SearchMain = () => {
    const firestore = getFirestore();
    const [searchResults, setSearchResults] = useState();
    const layout = useWindowDimensions();
    const navigation = useNavigation();
    const auth = getAuth();
    const [username, setUsername] = useState(null);

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            async function getUser() {
                const user = await getDoc(doc(firestore, "users", auth.currentUser.uid));
                if (user.exists()) {
                    setUsername(user.data().username);
                }
            }
            getUser();
        }
        return () => isSubscribed = false;
    }, []);

    async function handleSearch(input) {
        if (input.length >= MIN_SEARCH_INPUT_LENGTH) {
            const userQuery = query(collection(firestore, "users"), where('username', '>=', input.toLowerCase()), where('username', '<=', input.toLowerCase() + '~'), where('username', '!=', username))
            const querySnapshot = await getDocs(userQuery);
            setSearchResults(
                querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    username: doc.data().username,
                    displayName: doc.data().displayName,
                    photoURL: doc.data().photoURL
                }))
            );
        }
    }

    return (
        <Box alignItems="center">
            <VStack>
                <Input mx="3" placeholder="Find your friends" w="100%" onChangeText={(input) => handleSearch(input)} autoCapitalize='none' />
                <FlatList mx={layout.width * 0.025} keyboardShouldPersistTaps='handled' data={searchResults} renderItem={({
                    item
                }) => <UserEntry userData={item} action={() => navigation.push("User Profile", { userId: item.id })} />} keyExtractor={item => item.id} />
            </VStack>
        </Box>
    );
}

export default SearchMain