import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../Components/Chat/chatSlice';
import exploreReducer from '../Components/Explore/exploreSlice';
import friendsReducer from '../Components/Friends/friendsSlice';
import userReducer from '../Components/User/userSlice';

export default configureStore({
    reducer: {
        explore: exploreReducer,
        user: userReducer,
        chat: chatReducer,
        friends: friendsReducer
    }
})