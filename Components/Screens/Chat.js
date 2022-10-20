import React from 'react'
import ChatMain from '../Chat/ChatMain'
import UserProfile from '../User/UserProfile';
import FriendsRequestsList from '../User/FriendRequestsList';
import AddParticipants from '../Chat/AddParticipants';
import AddSubject from '../Chat/AddSubject';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const Chat = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Chat" component={ChatMain} />
            <Stack.Screen name="Add Participants" component={AddParticipants} />
            <Stack.Screen name="Add Subject" component={AddSubject} />
            <Stack.Screen name="User Profile" component={UserProfile} options={{ title: "" }} />
            <Stack.Screen name="Friend Requests" component={FriendsRequestsList} />
        </Stack.Navigator>
    )
}

export default Chat