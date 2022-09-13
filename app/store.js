import { configureStore } from '@reduxjs/toolkit';
import exploreFilterReducer from '../Components/Explore/exploreFilterSlice';

export default configureStore({
    reducer: {
        exploreFilter: exploreFilterReducer
    }
})