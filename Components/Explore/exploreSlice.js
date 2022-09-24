import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getPlaceDetails } from '../../services/googlePlaces/getPlaceDetails';
import { nearbySearchByProminence, nearbySearchWithNextPageToken } from '../../services/googlePlaces/nearbySearch';

export const bufferSize = 4;
export const undoAmount = 3;
const fetchOffset = 3;

// bufferSize must be greater than or equal to undoAmount

export const fetchPlaceIds = createAsyncThunk('explore/fetchPlaceIds', async (args, { getState }) => {
    const state = getState();

    if (state.explore.nextPageToken) {
        const response = await nearbySearchWithNextPageToken(state.explore.location.latitude, state.explore.location.longitude, state.explore.radius, state.explore.type, state.explore.minPrice, state.explore.maxPrice, 'english', state.explore.nextPageToken);
        return response.data;
    }

    const response = await nearbySearchByProminence(state.explore.location.latitude, state.explore.location.longitude, state.explore.radius, state.explore.type, state.explore.minPrice, state.explore.maxPrice, 'english');
    return response.data;
})

export const fetchPlaceDetails = createAsyncThunk('explore/fetchPlaceDetails', async (args, { getState }) => {
    const state = getState();
    if (!state.explore.buffer[bufferSize - 1]) {
        return -1;
    }
    const response = await getPlaceDetails(state.explore.buffer[bufferSize - 1].place_id);
    return response.data;
})

export const exploreReducer = createSlice({
    name: 'explore',
    initialState: {
        location: {
            latitude: null,
            longitude: null
        },
        locationStatus: 'idle',
        radius: 2000,
        type: "restaurant",
        keywords: [],
        minPrice: 0,
        maxPrice: 4,
        filterModalVisible: false,
        region: {
            latitude: null,
            longitude: null,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        },
        mapMarker: {
            latitude: null,
            longitude: null
        },
        placeIds: [],
        placeDetails: null,
        nextPageToken: null,
        placeIdStatus: 'idle',
        placeIdError: null,
        placeDetailsStatus: 'idle',
        placeDetailsError: null,
        needMoreData: false,
        buffer: [],
        photoCount: [],
        nearbySearchEndReached: false
    },
    reducers: {
        submitFilter: (state) => {
            state.placeIds = [];
            state.placeDetails = null;
            state.nextPageToken = null;
            state.placeIdStatus = 'idle';
            state.placeIdError = null;
            state.placeDetailsStatus = 'idle';
            state.placeDetailsError = null;
            state.needMoreData = false;
            state.buffer = [];
            state.photoCount = [];
            state.nearbySearchEndReached = false;
        },
        setExploreLocation: (state, action) => {
            state.location = action.payload;
            state.locationStatus = 'succeeded';
        },
        changeRadius: (state, action) => {
            state.radius = action.payload;
        },
        changeMinPrice: (state, action) => {
            state.minPrice = action.payload;
        },
        changeMaxPrice: (state, action) => {
            state.maxPrice = action.payload;
        },
        setType: (state, action) => {
            state.type = action.payload
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
        setRegion: (state, action) => {
            state.region = action.payload;
        },
        setMapMarker: (state, action) => {
            state.mapMarker = action.payload
        },
        concatBuffer: (state) => {
            state.buffer = Array(state.placeIds.length - bufferSize < 0 ? bufferSize - state.placeIds.length : 0).fill(null).concat(state.placeIds.slice(state.placeIds.length - bufferSize > 0 ? state.placeIds.length - bufferSize : 0, state.placeIds.length).concat(state.buffer));
            state.placeIds.splice(state.placeIds.length - bufferSize > 0 ? state.placeIds.length - bufferSize : 0, bufferSize);
            state.photoCount = Array(bufferSize).fill(0);
            console.log(state.buffer.map(i => i ? i.name : "empty"))
        },
        swipe: (state) => {
            if (state.buffer.length >= bufferSize + undoAmount) {
                state.buffer.pop();
                state.photoCount.pop();
            }
            if (state.placeIds.length > 0) {
                state.buffer.unshift(state.placeIds.pop());
                state.photoCount.unshift(0);
                if (state.placeIds.length <= fetchOffset) {
                    state.needMoreData = true;
                }
            } else {
                state.buffer.unshift(null);
                state.photoCount.unshift(null);
                state.needMoreData = true;
            }
            console.log(state.buffer.map(i => i ? i.name : "empty"))
        },
        undo: (state) => {
            state.placeIds.push(state.buffer.shift());
            state.photoCount.shift()
            state.buffer.push(null);
            state.photoCount.push(null);
            console.log(state.buffer.map(i => i ? i.name : "empty"))
        },
        increasePhotoCount: (state) => {
            state.photoCount[bufferSize - 1] = state.photoCount[bufferSize - 1] + 1;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPlaceIds.pending, (state, action) => {
                state.placeIdStatus = 'loading';
            })
            .addCase(fetchPlaceIds.fulfilled, (state, action) => {
                state.nextPageToken = action.payload.next_page_token ? action.payload.next_page_token : null;
                if (!state.nextPageToken) {
                    state.nearbySearchEndReached = true;
                }
                state.placeIds = action.payload.results.map(result => {
                    return {
                        "place_id": result.place_id,
                        "name": result.name,
                        "rating": result.rating,
                        "user_ratings_total": result.user_ratings_total,
                        "price_level": result.price_level,
                        "photos": result.photos
                    }
                }).reverse().concat(state.placeIds);
                state.needMoreData = false;
                state.placeIdStatus = 'succeeded';
            })
            .addCase(fetchPlaceIds.rejected, (state, action) => {
                state.placeIdError = action.error.message;
                state.placeIdStatus = 'failed';
            })
            .addCase(fetchPlaceDetails.pending, (state, action) => {
                state.placeDetailsStatus = 'loading';
            })
            .addCase(fetchPlaceDetails.fulfilled, (state, action) => {
                if (action.payload === -1) {
                    state.placeDetails = null;
                } else {
                    state.placeDetails = action.payload.result;
                }
                state.placeDetailsStatus = 'succeeded';
            })
            .addCase(fetchPlaceDetails.rejected, (state, action) => {
                state.placeDetailsError = action.error.message;
                state.placeDetailsStatus = 'failed';
            })
    }
})

export const { changeRadius,
    changeMinPrice,
    changeMaxPrice,
    setType,
    addKeyword,
    removeKeyword,
    openFilterModal,
    closeFilterModal,
    submitFilter,
    concatBuffer,
    swipe,
    undo,
    setExploreLocation,
    setMapMarker,
    setRegion,
    increasePhotoCount
} = exploreReducer.actions

export const selectRadius = state => state.explore.radius
export const selectType = state => state.explore.type
export const selectKeywords = state => state.explore.keywords
export const selectMinPrice = state => state.explore.minPrice
export const selectMaxPrice = state => state.explore.maxPrice
export const selectFilterModalVisible = state => state.explore.filterModalVisible
export const selectPlaceIdStatus = state => state.explore.placeIdStatus
export const selectPlaceIdError = state => state.explore.placeIdError
export const selectPlaceIdLength = state => state.explore.placeIds.length
export const selectPlaceDetails = state => state.explore.placeDetails
export const selectPlaceDetailsStatus = state => state.explore.placeDetailsStatus
export const selectPlaceDetailsError = state => state.explore.placeDetailsError
export const selectExploreBuffer = state => state.explore.buffer
export const selectNeedMoreData = state => state.explore.needMoreData
export const selectNearbySearchEndReached = state => state.explore.nearbySearchEndReached
export const selectExploreLocation = state => state.explore.location
export const selectExploreLocationStatus = state => state.explore.locationStatus
export const selectExploreRegion = state => state.explore.region
export const selectExploreMapMarker = state => state.explore.mapMarker

export default exploreReducer.reducer