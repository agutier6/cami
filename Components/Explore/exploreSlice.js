import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getPlaceDetails } from '../../services/googlePlaces/getPlaceDetails';
import { nearbySearchByProminence, nearbySearchWithNextPageToken } from '../../services/googlePlaces/nearbySearch';

export const fetchPlaceIds = createAsyncThunk('exploreInfinite/fetchPlaceIds', async ({ lat, long }, { getState }) => {
    const state = getState();

    if (state.explore.nextPageToken) {
        const response = await nearbySearchWithNextPageToken(lat, long, state.explore.radius, 'restaurant', '', state.explore.minPrice, state.explore.maxPrice, 'english', state.explore.nextPageToken);
        return response.data;
    }

    const response = await nearbySearchByProminence(lat, long, state.explore.radius, 'restaurant', '', state.explore.minPrice, state.explore.maxPrice, 'english');
    return response.data;
})

export const fetchPlaceDetails = createAsyncThunk('exploreInfinite/fetchPlaceDetails', async ({ count }, { getState }) => {
    const state = getState();
    const response = await getPlaceDetails(state.explore.placeIds[state.explore.placeCount]);
    return response.data;
})

export const exploreReducer = createSlice({
    name: 'explore',
    initialState: {
        radius: 500,
        type: ['restaurant'],
        keywords: [],
        minPrice: 1,
        maxPrice: 4,
        filterModalVisible: false,
        units: true, //true is miles false is km
        placeIds: [],
        placeDetails: [],
        nextPageToken: null,
        pageSize: 0,
        placeIdStatus: 'idle',
        placeIdError: null,
        placeDetailsStatus: 'idle',
        placeDetailsError: null,
        placeCount: 0
    },
    reducers: {
        changeRadius: (state, action) => {
            state.radius = action.payload;
        },
        changeMinPrice: (state, action) => {
            state.minPrice = action.payload;
        },
        changeMaxPrice: (state, action) => {
            state.maxPrice = action.payload;
        },
        addType: (state, action) => {
            if (!state.type.find(action.payload)) {
                state.type.push(action.payload);
            }
        },
        removeType: (state, action) => {
            state.type = state.type.filter(function (value) {
                return value != action.payload;
            });
        },
        addKeyword: (state, action) => {
            if (!state.keywords.find(action.payload)) {
                state.keywords.push(action.payload);
            }
        },
        removeKeyword: (state, action) => {
            state.keywords = state.keywords.filter(function (value) {
                return value != action.payload;
            });
        },
        openFilterModal: (state) => {
            state.filterModalVisible = true;
        }
        ,
        closeFilterModal: (state) => {
            state.filterModalVisible = false;
        },
        toggleUnits: (state) => {
            state.units = !state.units;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPlaceIds.pending, (state, action) => {
                state.placeIdStatus = 'loading';
            })
            .addCase(fetchPlaceIds.fulfilled, (state, action) => {
                state.placeIdStatus = 'succeeded';
                state.pageSize = action.payload.results.length
                state.placeIds = state.placeIds.concat(action.payload.results.map(result => result.place_id));
                state.nextPageToken = action.payload.next_page_token ? action.payload.next_page_token : null;
            })
            .addCase(fetchPlaceIds.rejected, (state, action) => {
                state.placeIdStatus = 'failed';
                state.placeIdError = action.error.message;
            })
            .addCase(fetchPlaceDetails.pending, (state, action) => {
                state.placeDetailsStatus = 'loading';
            })
            .addCase(fetchPlaceDetails.fulfilled, (state, action) => {
                state.placeDetailsStatus = 'succeeded';
                state.placeDetails.push(action.payload.result);
                state.placeCount++;
                // if (state.placeDetails.length > 10) {
                //     state.placeDetails.shift();
                // }
            })
            .addCase(fetchPlaceDetails.rejected, (state, action) => {
                state.placeDetailsStatus = 'failed';
                state.placeDetailsError = action.error.message;
            })
    }
})

export const { changeRadius,
    changeMinPrice,
    changeMaxPrice,
    addType,
    removeType,
    addKeyword,
    removeKeyword,
    openFilterModal,
    closeFilterModal,
    toggleUnits
} = exploreReducer.actions

export const selectRadius = state => state.explore.radius
export const selectType = state => state.explore.type
export const selectKeywords = state => state.explore.keywords
export const selectMinPrice = state => state.explore.minPrice
export const selectMaxPrice = state => state.explore.maxPrice
export const selectFilterModalVisible = state => state.explore.filterModalVisible
export const selectUnits = state => state.explore.units
// export const selectPlaceIds = state => state.explore.placeIds
export const selectPlaceIdStatus = state => state.explore.placeIdStatus
export const selectPlaceIdError = state => state.explore.placeIdError
export const selectPlaceDetails = state => state.explore.placeDetails
export const selectPlaceDetailsStatus = state => state.explore.placeDetailsStatus
export const selectPlaceDetailsError = state => state.explore.placeDetailsError
export const selectPageSize = state => state.explore.pageSize
export const selectPlaceCount = state => state.explore.placeCount

export default exploreReducer.reducer