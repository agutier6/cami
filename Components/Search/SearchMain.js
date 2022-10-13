import React, { useState, useEffect } from 'react';
import { Box, Input, VStack, HStack, FlatList, Avatar, Text, Pressable, Spacer } from 'native-base';
import { collection, query, where, getFirestore, getDocs, getDoc, doc } from "firebase/firestore";
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

const MIN_SEARCH_INPUT_LENGTH = 3;

const SearchMain = () => {
    const firestore = getFirestore();
    const [searchResults, setSearchResults] = useState();
    const layout = useWindowDimensions();
    const navigate = useNavigation();
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
                <FlatList keyboardShouldPersistTaps='handled' data={searchResults} renderItem={({
                    item
                }) => <Pressable onPress={() => navigate.navigate("User Profile", { userId: item.id })}
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

export default SearchMain