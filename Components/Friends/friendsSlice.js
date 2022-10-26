import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { acceptFriendRequestAsync, cancelFriendRequestAsync, deleteFriendAsync, getFriendsAsync, rejectFriendRequestAsync, sendFriendRequestAsync } from '../../services/friends';

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

export const friendsReducer = createSlice({
    name: 'friends',
    initialState: {
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
    clearFriendDetails,
    clearRequestDetails
} = friendsReducer.actions

export const selectFriendRequestStatus = state => state.friends.friendRequestStatus
// export const selectFriendRequestError = state => state.friends.friendRequestError
export const selectAcceptRequestStatus = state => state.friends.acceptRequestStatus
// export const selectAcceptRequestError = state => state.friends.acceptRequestError
export const selectRejectRequestStatus = state => state.friends.rejectRequestStatus
// export const selectRejectRequestError = state => state.friends.rejectRequestError
export const selectDeleteFriendStatus = state => state.friends.deleteFriendStatus
// export const selectDeleteFriendError = state => state.friends.deleteFriendError
export const selectCancelFriendRequestStatus = state => state.friends.cancelRequestStatus
// export const selectCancelFriendRequestError = state => state.friends.cancelRequestError
export const selectGetFriendsStatus = state => state.friends.getFriendsStatus
export const selectFriends = state => state.friends.friends

export default friendsReducer.reducer