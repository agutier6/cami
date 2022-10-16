import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createChatAsync } from '../../services/chats';

export const createChat = createAsyncThunk('chat/createChat', async ({ sender, recipient }) => {
    await createChatAsync(sender, recipient);
});

export const chatReducer = createSlice({
    name: 'chat',
    initialState: {
        createChatStatus: {},
        createChatError: {},
        getChatsStatus: 'idle',
        getChatsError: null,
        chats: null
    },
    reducers: {
        clearChats: (state) => {
            state.getChatsStatus = 'idle';
            state.getChatsError = null;
            state.chats = null;
        },
        clearCreateChat: (state) => {
            state.createChatStatus = {};
            state.createChatError = {};
        }
    },
    extraReducers(builder) {
        builder
            .addCase(createChat.pending, (state, action) => {
                state.createChatStatus[action.meta.requestId] = 'loading';
            })
            .addCase(createChat.fulfilled, (state, action) => {
                state.createChatStatus[action.meta.requestId] = 'succeeded';
            })
            .addCase(createChat.rejected, (state, action) => {
                state.createChatError[action.meta.requestId] = action.error.message;
                state.createChatStatus[action.meta.requestId] = 'failed';
            })
        // .addCase(getChats.pending, (state, action) => {
        //     state.getChatsStatus = 'loading';
        // })
        // .addCase(getChats.fulfilled, (state, action) => {
        //     state.friends = action.payload;
        //     state.getChatsStatus = 'succeeded';
        // })
        // .addCase(getChats.rejected, (state, action) => {
        //     state.getChatsError = action.error.message;
        //     state.getChatsStatus = 'failed';
        // })
    }
})

export const {
    clearChats,
    clearCreateChat
} = chatReducer.actions

export const selectCreateChatStatus = state => state.chat.createChatStatus
// export const selectCreateChatError = state => state.chat.createChatError
export const selectGetChatsStatus = state => state.chat.getChatsStatus
export const selectChats = state => state.chat.chats

export default chatReducer.reducer