import { configureStore } from '@reduxjs/toolkit';
import exploreReducer from '../Components/Explore/exploreSlice';
import userReducer from '../Components/User/userSlice';

export default configureStore({
    reducer: {
        explore: exploreReducer,
        user: userReducer
    }
})