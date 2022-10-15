import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as Location from 'expo-location';
import { doc, getFirestore, getDocs, runTransaction, query, collection, where } from 'firebase/firestore';

const firestore = getFirestore();

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
    // const firestore = getFirestore();
    try {
        await runTransaction(firestore, async (transaction) => {
            const friendEntry = await transaction.get(doc(firestore, `users/${sender}/friends`, recipient));
            if (friendEntry.exists()) {
                throw "Already sent friend request!";
            }
            transaction.set(doc(firestore, `users/${sender}/friends`, recipient), { status: 'sent' });
            transaction.set(doc(firestore, `users/${recipient}/friends`, sender), { status: 'received' });
        })
    } catch (error) {
        console.error(error);
    }
    return;
});

export const acceptFriendRequest = createAsyncThunk('user/acceptFriendRequest', async ({ sender, recipient }) => {
    // const firestore = getFirestore();
    try {
        await runTransaction(firestore, async (transaction) => {
            const friendEntry = await transaction.get(doc(firestore, `users/${recipient}/friends`, sender));
            if (!friendEntry.exists() || friendEntry.data().status != 'received') {
                throw "Friend request not found";
            }
            const recipientNumFriends = await transaction.get(doc(firestore, 'users', recipient));
            const senderNumFriends = await transaction.get(doc(firestore, 'users', sender));
            transaction.update(doc(firestore, `users/${recipient}/friends`, sender), { status: 'accepted' });
            transaction.update(doc(firestore, `users/${sender}/friends`, recipient), { status: 'accepted' });
            transaction.update(doc(firestore, 'users', recipient), { numFriends: recipientNumFriends.exists() && recipientNumFriends.data()["numFriends"] ? recipientNumFriends.data().numFriends + 1 : 1 });
            transaction.update(doc(firestore, 'users', sender), { numFriends: senderNumFriends.exists() && senderNumFriends.data()["numFriends"] ? senderNumFriends.data().numFriends + 1 : 1 });
        })
    } catch (error) {
        console.error(error);
    }
});

export const rejectFriendRequest = createAsyncThunk('user/rejectFriendRequest', async ({ sender, recipient }) => {
    // const firestore = getFirestore();
    try {
        await runTransaction(firestore, async (transaction) => {
            const friendEntry = await transaction.get(doc(firestore, `users/${recipient}/friends`, sender));
            if (!friendEntry.exists() || friendEntry.data().status != 'received') {
                throw "Friend request not found";
            }
            transaction.delete(doc(firestore, `users/${sender}/friends`, recipient));
            transaction.delete(doc(firestore, `users/${recipient}/friends`, sender));
        })
    } catch (error) {
        console.error(error);
    }
});

export const deleteFriend = createAsyncThunk('user/deleteFriend', async ({ sender, recipient }) => {
    // const firestore = getFirestore();
    try {
        await runTransaction(firestore, async (transaction) => {
            const friendEntry = await transaction.get(doc(firestore, `users/${recipient}/friends`, sender));
            if (!friendEntry.exists()) {
                throw "Could not find friend";
            }
            const recipientNumFriends = await transaction.get(doc(firestore, 'users', recipient));
            const senderNumFriends = await transaction.get(doc(firestore, 'users', sender));
            transaction.delete(doc(firestore, `users/${sender}/friends`, recipient));
            transaction.delete(doc(firestore, `users/${recipient}/friends`, sender));
            transaction.update(doc(firestore, 'users', recipient), { numFriends: recipientNumFriends.exists() && recipientNumFriends.data()["numFriends"] ? recipientNumFriends.data().numFriends - 1 : 0 });
            transaction.update(doc(firestore, 'users', sender), { numFriends: senderNumFriends.exists() && senderNumFriends.data()["numFriends"] ? senderNumFriends.data().numFriends - 1 : 0 });
        })
    } catch (error) {
        console.error(error);
    }
})

export const cancelFriendRequest = createAsyncThunk('user/cancelFriendRequest', async ({ sender, recipient }) => {
    // const firestore = getFirestore();
    try {
        await runTransaction(firestore, async (transaction) => {
            const friendEntry = await transaction.get(doc(firestore, `users/${recipient}/friends`, sender));
            if (!friendEntry.exists() || friendEntry.data().status != 'received') {
                throw "Could not find friend request";
            }
            transaction.delete(doc(firestore, `users/${sender}/friends`, recipient));
            transaction.delete(doc(firestore, `users/${recipient}/friends`, sender));
        })
    } catch (error) {
        console.error(error);
    }
})

export const getFriends = createAsyncThunk('user/getFriends', async ({ status, userId }) => {
    const friendsQuery = query(collection(firestore, `users/${userId}/friends`), where('status', '==', status))
    const querySnapshot = await getDocs(friendsQuery);
    return querySnapshot.docs.map(doc => doc.id);
})

export const getFriendsData = createAsyncThunk('user/getFriendsData', async (args, { getState }) => {
    const state = getState();
    let tempFriendsData = [];
    for (let i = 0; i < state.user.friends.length; i += 10) {
        let array = state.user.friends.slice(i, Math.max(state.user.friends.length, i + 10));
        if (array.length > 0) {
            const friendsDataQuery = query(collection(firestore, 'users'), where('__name__', 'in', array))
            const querySnapshot = await getDocs(friendsDataQuery);
            tempFriendsData = tempFriendsData.concat(querySnapshot.docs.map(doc => ({
                id: doc.id,
                username: doc.data().username,
                displayName: doc.data().displayName,
                photoURL: doc.data().photoURL
            })))
        }
    }
    return tempFriendsData;
})

export const userReducer = createSlice({
    name: 'user',
    initialState: {
        location: null,
        locationStatus: 'idle',
        locationError: null,
        friendRequestStatus: 'idle',
        friendRequestError: null,
        acceptRequestStatus: 'idle',
        acceptRequestError: null,
        deleteFriendStatus: 'idle',
        deleteFriendError: null,
        rejectRequestStatus: 'idle',
        rejectRequestError: null,
        cancelRequestStatus: 'idle',
        cancelRequestError: null,
        getFriendsStatus: 'idle',
        getFriendsError: null,
        getFriendsDataStatus: 'idle',
        getFriendsDataError: null,
        friends: null,
        friendsData: []
    },
    reducers: {
        clearLocation: (state) => {
            state.location = null;
        },
        clearRequestDetails: (state) => {
            state.friendRequestStatus = 'idle';
            state.friendRequestError = null;
            state.acceptRequestStatus = 'idle';
            state.acceptRequestError = null;
            state.deleteFriendStatus = 'idle';
            state.deleteFriendError = null;
            state.rejectRequestStatus = 'idle';
            state.rejectRequestError = null;
            state.cancelRequestStatus = 'idle';
            state.cancelRequestError = null;
        },
        clearFriendDetails: (state) => {
            state.getFriendsStatus = 'idle';
            state.getFriendsError = null;
            state.getFriendsDataStatus = 'idle';
            state.getFriendsDataError = null;
        },
        clearFriendData: (state) => {
            state.friends = null;
            state.friendsData = [];
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
                state.friendRequestStatus = 'loading';
            })
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                state.friendRequestStatus = 'succeeded';
            })
            .addCase(sendFriendRequest.rejected, (state, action) => {
                state.friendRequestError = action.error.message;
                state.friendRequestStatus = 'failed';
            })
            .addCase(acceptFriendRequest.pending, (state, action) => {
                state.acceptRequestStatus = 'loading';
            })
            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                state.acceptRequestStatus = 'succeeded';
            })
            .addCase(acceptFriendRequest.rejected, (state, action) => {
                state.acceptRequestError = action.error.message;
                state.acceptRequestStatus = 'failed';
            })
            .addCase(rejectFriendRequest.pending, (state, action) => {
                state.rejectRequestStatus = 'loading';
            })
            .addCase(rejectFriendRequest.fulfilled, (state, action) => {
                state.rejectRequestStatus = 'succeeded';
            })
            .addCase(rejectFriendRequest.rejected, (state, action) => {
                state.rejectRequestError = action.error.message;
                state.rejectRequestStatus = 'failed';
            })
            .addCase(deleteFriend.pending, (state, action) => {
                state.deleteFriendStatus = 'loading';
            })
            .addCase(deleteFriend.fulfilled, (state, action) => {
                state.deleteFriendStatus = 'succeeded';
            })
            .addCase(deleteFriend.rejected, (state, action) => {
                state.deleteFriendError = action.error.message;
                state.deleteFriendStatus = 'failed';
            })
            .addCase(cancelFriendRequest.pending, (state, action) => {
                state.cancelRequestStatus = 'loading';
            })
            .addCase(cancelFriendRequest.fulfilled, (state, action) => {
                state.cancelRequestStatus = 'succeeded';
            })
            .addCase(cancelFriendRequest.rejected, (state, action) => {
                state.cancelRequestError = action.error.message;
                state.cancelRequestStatus = 'failed';
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
            .addCase(getFriendsData.pending, (state, action) => {
                state.getFriendsDataStatus = 'loading';
            })
            .addCase(getFriendsData.fulfilled, (state, action) => {
                state.friendsData = action.payload;
                state.getFriendsDataStatus = 'succeeded';
            })
            .addCase(getFriendsData.rejected, (state, action) => {
                state.getFriendsDataError = action.error.message;
                state.getFriendsDataStatus = 'failed';
            })
    }
})

export const {
    clearLocation,
    clearFriendDetails,
    clearRequestDetails,
    clearFriendData
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
export const selectGetFriendsDataStatus = state => state.user.getFriendsDataStatus
export const selectFriendsData = state => state.user.friendsData
export const selectFriends = state => state.user.friends

export default userReducer.reducer