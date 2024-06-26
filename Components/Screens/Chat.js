import React from 'react'
import ChatMain from '../Chat/ChatMain'
import UserProfile from '../User/UserProfile';
import FriendsRequestsList from '../Friends/FriendRequestsList';
import AddParticipants from '../Chat/AddParticipants';
import AddSubject from '../Chat/AddSubject';
import GroupChat from '../Chat/GroupChat';
import ChatInfo from '../Chat/ChatInfo';
import CreateChat from '../Chat/CreateChat';
import FriendsList from '../Friends/FriendsList';
import EditGroupDescription from '../Chat/EditGroupDescription';
import EditGroupName from '../Chat/EditGroupName';
import SearchGroupParticipants from '../Chat/SearchGroupParticipants';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesignHeaderButtons } from '../Navigation/MyHeaderButtons.js';
import { Item } from 'react-navigation-header-buttons';
import GroupIcon from '../Utils/GroupIcon'
import { HStack, Heading, Pressable } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { selectGroupName, selectGroupPhoto } from '../Chat/chatSlice';

const Stack = createStackNavigator();

const Chat = () => {
    const groupPhoto = useSelector(selectGroupPhoto);
    const groupName = useSelector(selectGroupName);
    const layout = useWindowDimensions();
    return (
        <Stack.Navigator>
            <Stack.Screen name="Chat" component={ChatMain}
                options={({ navigation }) => ({
                    headerRight: () => (
                        <AntDesignHeaderButtons>
                            <Item title="friend-requests" iconName="adduser" onPress={() => navigation.navigate("Friend Requests")} />
                        </AntDesignHeaderButtons>
                    )
                })} />
            <Stack.Screen name="Add Participants" component={AddParticipants} />
            <Stack.Screen name="Add Subject" component={AddSubject} />
            <Stack.Screen name="User Profile" component={UserProfile} options={{ title: "" }} />
            <Stack.Screen name="Friend Requests" component={FriendsRequestsList} />
            <Stack.Screen name="Group Chat" component={GroupChat} options={({ route, navigation }) => ({
                headerTitle: () => <Pressable onPress={() => navigation.push("Chat Info", {
                    chatId: route.params["chatId"],
                    chatName: route.params["chatName"],
                    photoURL: route.params["photoURL"]
                })}>
                    <HStack alignItems="center" space={layout.width * 0.025}>
                        <GroupIcon size={layout.height * 0.05} photoURL={groupPhoto[route.params["chatId"]] ? groupPhoto[route.params["chatId"]] : route.params["photoURL"]} />
                        <Heading color="muted.700" size="md">{groupName[route.params["chatId"]] ? groupName[route.params["chatId"]] : route.params["chatName"]}</Heading>
                    </HStack>
                </Pressable>
            })} />
            <Stack.Screen name="Chat Info" component={ChatInfo} options={{ title: "" }} />
            <Stack.Screen name="Friends" component={FriendsList} />
            <Stack.Screen name="Group Description" component={EditGroupDescription} />
            <Stack.Screen name="Group Name" component={EditGroupName} />
            <Stack.Screen name="Search Participants" component={SearchGroupParticipants} />
            <Stack.Screen name="Create Chat" component={CreateChat} />
        </Stack.Navigator>
    )
}

export default Chat