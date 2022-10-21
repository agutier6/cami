import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createChatAsync, getChatDataAsync } from '../../services/chats';

export const createChat = createAsyncThunk('chat/createChat', async ({ sender, recipients, name, photoURI }) => {
    await createChatAsync(sender, recipients, name, photoURI);
});

export const getChatData = createAsyncThunk('chat/getChatData', async ({ chats }) => {
    return await getChatDataAsync(chats);
});
export const chatReducer = createSlice({
    name: 'chat',
    initialState: {
        createChatStatus: {},
        createChatError: {},
        getChatDataStatus: 'idle',
        getChatDataError: null,
        chatData: {}
    },
    reducers: {
        clearChatData: (state) => {
            state.getChatDataStatus = 'idle';
            state.getChatDataError = null;
            state.chatData = {};
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
            .addCase(getChatData.pending, (state, action) => {
                state.getChatDataStatus[action.meta.requestId] = 'loading';
            })
            .addCase(getChatData.fulfilled, (state, action) => {
                action.payload.forEach((chat => {
                    state.chatData[chat["id"]] = {
                        name: chat["name"],
                        photoURL: chat["photoURL"]
                    };
                }))
                state.getChatDataStatus[action.meta.requestId] = 'succeeded';
            })
            .addCase(getChatData.rejected, (state, action) => {
                state.getChatDataError[action.meta.requestId] = action.error.message;
                state.getChatDataStatus[action.meta.requestId] = 'failed';
            })
    }
})

export const {
    clearChatData,
    clearCreateChat
} = chatReducer.actions

export const selectCreateChatStatus = state => state.chat.createChatStatus
export const selectCreateChatError = state => state.chat.createChatError
export const selectGetChatsStatus = state => state.chat.getChatDataStatus
export const selectGetChatDataError = state => state.chat.getChatDataError
export const selectChatData = state => state.chat.chatData

export default chatReducer.reducer