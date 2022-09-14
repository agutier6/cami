import { configureStore } from '@reduxjs/toolkit';
import exploreReducer from '../Components/Explore/exploreSlice';

export default configureStore({
    reducer: {
        explore: exploreReducer
    }
})