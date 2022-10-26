import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as Location from 'expo-location';

export const subscribeLocationForeground = createAsyncThunk('user/subscribeLocationForeground', async (arg, { getState }) => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status != 'granted') {
        status = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return null;
        }
    }
    return await Location.getCurrentPositionAsync({});
});

export const userReducer = createSlice({
    name: 'user',
    initialState: {
        location: null,
        locationStatus: 'idle',
        locationError: null
    },
    reducers: {
        clearLocation: (state) => {
            state.location = null;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(subscribeLocationForeground.pending, (state, action) => {
                state.locationStatus = 'loading';
            })
            .addCase(subscribeLocationForeground.fulfilled, (state, action) => {
                if (action.payload) {
                    state.location = action.payload;
                    state.locationStatus = 'succeeded';
                } else {
                    state.locationError = 'Error: Location access not granted.';
                    state.locationStatus = 'denied';
                }
            })
            .addCase(subscribeLocationForeground.rejected, (state, action) => {
                state.locationError = action.error.message;
                state.locationStatus = 'failed';
            })
    }
})

export const {
    clearLocation
} = userReducer.actions

export const selectLocation = state => state.user.location
export const selectLocationStatus = state => state.user.locationStatus
export const selectLocationError = state => state.user.locationError

export default userReducer.reducer