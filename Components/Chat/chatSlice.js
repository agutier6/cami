import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createChatAsync, getChatDataAsync, editGroupDescriptionAsync, changeGroupPhotoAsync, changeGroupNameAsync, leaveGroupChatAsync } from '../../services/chats';

export const createChat = createAsyncThunk('chat/createChat', async ({ sender, recipients, name, photoURI, creatorName, description }) => {
    await createChatAsync(sender, recipients, name, photoURI, creatorName, description);
});

export const getChatData = createAsyncThunk('chat/getChatData', async ({ chats }) => {
    return await getChatDataAsync(chats);
});

export const editGroupDescription = createAsyncThunk('chat/editGroupDescription', async ({ chatId, description }) => {
    await editGroupDescriptionAsync(chatId, description);
});

export const changeGroupPhoto = createAsyncThunk('chat/changeGroupPhoto', async ({ chatId, photoURI }) => {
    await changeGroupPhotoAsync(chatId, photoURI);
});

export const changeGroupName = createAsyncThunk('chat/changeGroupName', async ({ chatId, name }) => {
    await changeGroupNameAsync(chatId, name);
});

export const leaveGroupChat = createAsyncThunk('chat/leaveGroupChat', async ({ chatId, userId }) => {
    await leaveGroupChatAsync(chatId, userId);
});

export const chatReducer = createSlice({
    name: 'chat',
    initialState: {
        createChatStatus: {},
        createChatError: {},
        leaveGroupChatStatus: {},
        leaveGroupChatError: {},
        getChatDataStatus: {},
        getChatDataError: {},
        chatData: {},
        editGroupDescriptionStatus: {},
        editGroupDescriptionError: {},
        groupDescription: {},
        changeGroupPhotoStatus: {},
        changeGroupPhotoError: {},
        groupPhoto: {},
        changeGroupNameStatus: {},
        changeGroupNameError: {},
        groupName: {}
    },
    reducers: {
        clearChatData: (state) => {
            state.getChatDataStatus = {};
            state.getChatDataError = {};
            state.chatData = {};
        },
        clearCreateChat: (state) => {
            state.createChatStatus = {};
            state.createChatError = {};
        },
        clearLeaveChat: (state) => {
            state.leaveGroupChatStatus = {};
            state.leaveGroupChatError = {};
        },
        clearGroupInfo: (state) => {
            state.editGroupDescriptionStatus = {};
            state.editGroupDescriptionError = {};
            state.groupDescription = {};
            state.changeGroupPhotoStatus = {};
            state.changeGroupPhotoError = {};
            state.groupPhoto = {};
            state.changeGroupNameStatus = {};
            state.changeGroupNameError = {};
            state.groupName = {};
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
            .addCase(leaveGroupChat.pending, (state, action) => {
                state.leaveGroupChatStatus[action.meta.requestId] = 'loading';
            })
            .addCase(leaveGroupChat.fulfilled, (state, action) => {
                state.leaveGroupChatStatus[action.meta.requestId] = 'succeeded';
            })
            .addCase(leaveGroupChat.rejected, (state, action) => {
                state.leaveGroupChatError[action.meta.requestId] = action.error.message;
                state.leaveGroupChatStatus[action.meta.requestId] = 'failed';
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
            .addCase(editGroupDescription.pending, (state, action) => {
                state.editGroupDescriptionStatus[action.meta.requestId] = 'loading';
            })
            .addCase(editGroupDescription.fulfilled, (state, action) => {
                state.groupDescription[action.meta.arg.chatId] = action.meta.arg.description;
                state.editGroupDescriptionStatus[action.meta.requestId] = 'succeeded';
            })
            .addCase(editGroupDescription.rejected, (state, action) => {
                state.editGroupDescriptionError[action.meta.requestId] = action.error.message;
                state.editGroupDescriptionStatus[action.meta.requestId] = 'failed';
            })
            .addCase(changeGroupPhoto.pending, (state, action) => {
                state.changeGroupPhotoStatus[action.meta.requestId] = 'loading';
            })
            .addCase(changeGroupPhoto.fulfilled, (state, action) => {
                state.groupPhoto[action.meta.arg.chatId] = action.meta.arg.photoURI;
                state.changeGroupPhotoStatus[action.meta.requestId] = 'succeeded';
            })
            .addCase(changeGroupPhoto.rejected, (state, action) => {
                state.changeGroupPhotoError[action.meta.requestId] = action.error.message;
                state.changeGroupPhotoStatus[action.meta.requestId] = 'failed';
            })
            .addCase(changeGroupName.pending, (state, action) => {
                state.changeGroupNameStatus[action.meta.requestId] = 'loading';
            })
            .addCase(changeGroupName.fulfilled, (state, action) => {
                state.groupName[action.meta.arg.chatId] = action.meta.arg.name;
                state.changeGroupNameStatus[action.meta.requestId] = 'succeeded';
            })
            .addCase(changeGroupName.rejected, (state, action) => {
                state.changeGroupNameError[action.meta.requestId] = action.error.message;
                state.changeGroupNameStatus[action.meta.requestId] = 'failed';
            })
    }
})

export const {
    clearChatData,
    clearLeaveChat,
    clearCreateChat,
    clearGroupInfo
} = chatReducer.actions

export const selectCreateChatStatus = state => state.chat.createChatStatus
export const selectCreateChatError = state => state.chat.createChatError
export const selectLeaveGroupChatStatus = state => state.chat.leaveGroupChatStatus
export const selectLeaveGroupChatError = state => state.chat.leaveGroupChatError
export const selectGetChatsStatus = state => state.chat.getChatDataStatus
export const selectGetChatDataError = state => state.chat.getChatDataError
export const selectChatData = state => state.chat.chatData
export const selectEditGroupDescriptionStatus = state => state.chat.editGroupDescriptionStatus
export const selectEditGroupDescriptionError = state => state.chat.editGroupDescriptionError
export const selectGroupDescription = state => state.chat.groupDescription
export const selectChangeGroupPhotoStatus = state => state.chat.changeGroupPhotoStatus
export const selectChangeGroupPhotoError = state => state.chat.changeGroupPhotoError
export const selectGroupPhoto = state => state.chat.groupPhoto
export const selectChangeGroupNameStatus = state => state.chat.changeGroupNameStatus
export const selectChangeGroupNameError = state => state.chat.changeGroupNameError
export const selectGroupName = state => state.chat.groupName

export default chatReducer.reducer