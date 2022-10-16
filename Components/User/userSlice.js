import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as Location from 'expo-location';
import { acceptFriendRequestAsync, cancelFriendRequestAsync, deleteFriendAsync, getFriendsAsync, rejectFriendRequestAsync, sendFriendRequestAsync } from '../../services/friends';

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

export const sendFriendRequest = createAsyncThunk('user/sendFriendRequest', async ({ sender, recipient }) => {
    await sendFriendRequestAsync(sender, recipient);
});

export const acceptFriendRequest = createAsyncThunk('user/acceptFriendRequest', async ({ sender, recipient }) => {
    await acceptFriendRequestAsync(sender, recipient);
});

export const rejectFriendRequest = createAsyncThunk('user/rejectFriendRequest', async ({ sender, recipient }) => {
    await rejectFriendRequestAsync(sender, recipient);
});

export const deleteFriend = createAsyncThunk('user/deleteFriend', async ({ sender, recipient }) => {
    await deleteFriendAsync(sender, recipient)
})

export const cancelFriendRequest = createAsyncThunk('user/cancelFriendRequest', async ({ sender, recipient }) => {
    await cancelFriendRequestAsync(sender, recipient);
})

export const getFriends = createAsyncThunk('user/getFriends', async ({ status, userId }) => {
    return await getFriendsAsync(status, userId);
})

export const userReducer = createSlice({
    name: 'user',
    initialState: {
        location: null,
        locationStatus: 'idle',
        locationError: null,
        friendRequestStatus: {},
        friendRequestError: {},
        acceptRequestStatus: {},
        acceptRequestError: {},
        deleteFriendStatus: {},
        deleteFriendError: {},
        rejectRequestStatus: {},
        rejectRequestError: {},
        cancelRequestStatus: {},
        cancelRequestError: {},
        getFriendsStatus: 'idle',
        getFriendsError: null,
        friends: null
    },
    reducers: {
        clearLocation: (state) => {
            state.location = null;
        },
        clearFriendDetails: (state) => {
            state.getFriendsStatus = 'idle';
            state.getFriendsError = null;
            state.friends = null;
        },
        clearRequestDetails: (state) => {
            state.friendRequestStatus = {};
            state.friendRequestError = {};
            state.acceptRequestStatus = {};
            state.acceptRequestError = {};
            state.deleteFriendStatus = {};
            state.deleteFriendError = {};
            state.rejectRequestStatus = {};
            state.rejectRequestError = {};
            state.cancelRequestStatus = {};
            state.cancelRequestError = {};
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
            .addCase(sendFriendRequest.pending, (state, action) => {
                state.friendRequestStatus[action.meta.requestId] = 'loading';
            })
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                state.friendRequestStatus[action.meta.requestId] = 'succeeded';
            })
            .addCase(sendFriendRequest.rejected, (state, action) => {
                state.friendRequestError[action.meta.requestId] = action.error.message;
                state.friendRequestStatus[action.meta.requestId] = 'failed';
            })
            .addCase(acceptFriendRequest.pending, (state, action) => {
                state.acceptRequestStatus[action.meta.requestId] = 'loading';
            })
            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                state.acceptRequestStatus[action.meta.requestId] = 'succeeded';
            })
            .addCase(acceptFriendRequest.rejected, (state, action) => {
                state.acceptRequestError[action.meta.requestId] = action.error.message;
                state.acceptRequestStatus[action.meta.requestId] = 'failed';
            })
            .addCase(rejectFriendRequest.pending, (state, action) => {
                state.rejectRequestStatus[action.meta.requestId] = 'loading';
            })
            .addCase(rejectFriendRequest.fulfilled, (state, action) => {
                state.rejectRequestStatus[action.meta.requestId] = 'succeeded';
            })
            .addCase(rejectFriendRequest.rejected, (state, action) => {
                state.rejectRequestError[action.meta.requestId] = action.error.message;
                state.rejectRequestStatus[action.meta.requestId] = 'failed';
            })
            .addCase(deleteFriend.pending, (state, action) => {
                state.deleteFriendStatus[action.meta.requestId] = 'loading';
            })
            .addCase(deleteFriend.fulfilled, (state, action) => {
                state.deleteFriendStatus[action.meta.requestId] = 'succeeded';
            })
            .addCase(deleteFriend.rejected, (state, action) => {
                state.deleteFriendError[action.meta.requestId] = action.error.message;
                state.deleteFriendStatus[action.meta.requestId] = 'failed';
            })
            .addCase(cancelFriendRequest.pending, (state, action) => {
                state.cancelRequestStatus[action.meta.requestId] = 'loading';
            })
            .addCase(cancelFriendRequest.fulfilled, (state, action) => {
                state.cancelRequestStatus[action.meta.requestId] = 'succeeded';
            })
            .addCase(cancelFriendRequest.rejected, (state, action) => {
                state.cancelRequestError[action.meta.requestId] = action.error.message;
                state.cancelRequestStatus[action.meta.requestId] = 'failed';
            })
            .addCase(getFriends.pending, (state, action) => {
                state.getFriendsStatus = 'loading';
            })
            .addCase(getFriends.fulfilled, (state, action) => {
                state.friends = action.payload;
                state.getFriendsStatus = 'succeeded';
            })
            .addCase(getFriends.rejected, (state, action) => {
                state.getFriendsError = action.error.message;
                state.getFriendsStatus = 'failed';
            })
    }
})

export const {
    clearLocation,
    clearFriendDetails,
    clearRequestDetails
} = userReducer.actions

export const selectLocation = state => state.user.location
export const selectLocationStatus = state => state.user.locationStatus
export const selectLocationError = state => state.user.locationError
export const selectFriendRequestStatus = state => state.user.friendRequestStatus
// export const selectFriendRequestError = state => state.user.friendRequestError
export const selectAcceptRequestStatus = state => state.user.acceptRequestStatus
// export const selectAcceptRequestError = state => state.user.acceptRequestError
export const selectRejectRequestStatus = state => state.user.rejectRequestStatus
// export const selectRejectRequestError = state => state.user.rejectRequestError
export const selectDeleteFriendStatus = state => state.user.deleteFriendStatus
// export const selectDeleteFriendError = state => state.user.deleteFriendError
export const selectCancelFriendRequestStatus = state => state.user.cancelRequestStatus
// export const selectCancelFriendRequestError = state => state.user.cancelRequestError
export const selectGetFriendsStatus = state => state.user.getFriendsStatus
export const selectFriends = state => state.user.friends

export default userReducer.reducer