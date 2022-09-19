import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getPlaceDetails } from '../../services/googlePlaces/getPlaceDetails';
import { nearbySearchByProminence, nearbySearchWithNextPageToken } from '../../services/googlePlaces/nearbySearch';

const bufferSize = 4;
const fetchOffset = 3;

export const fetchPlaceIds = createAsyncThunk('explore/fetchPlaceIds', async (args, { getState }) => {
    const state = getState();

    if (state.explore.nextPageToken) {
        const response = await nearbySearchWithNextPageToken(state.explore.location.latitude, state.explore.location.longitude, state.explore.radius, 'restaurant', '', state.explore.minPrice, state.explore.maxPrice, 'english', state.explore.nextPageToken);
        return response.data;
    }

    const response = await nearbySearchByProminence(state.explore.location.latitude, state.explore.location.longitude, state.explore.radius, 'restaurant', '', state.explore.minPrice, state.explore.maxPrice, 'english');
    return response.data;
})

export const fetchPlaceDetails = createAsyncThunk('explore/fetchPlaceDetails', async (args, { getState }) => {
    const state = getState();
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
        radius: 500,
        type: ['restaurant'],
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
        pageSize: 0,
        placeIdStatus: 'idle',
        placeIdError: null,
        placeDetailsStatus: 'idle',
        placeDetailsError: null,
        needMoreData: false,
        buffer: [],
        nearbySearchEndReached: false
    },
    reducers: {
        submitFilter: (state) => {
            state.placeIds = [];
            state.placeDetails = null;
            state.nextPageToken = null;
            state.pageSize = 0;
            state.placeIdStatus = 'idle';
            state.placeIdError = null;
            state.placeDetailsStatus = 'idle';
            state.placeDetailsError = null;
            state.needMoreData = false;
            state.buffer = [];
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
        setRegion: (state, action) => {
            state.region = action.payload;
        },
        setMapMarker: (state, action) => {
            state.mapMarker = action.payload
        },
        concatBuffer: (state) => {
            state.buffer = state.placeIds.slice(state.placeIds.length - bufferSize, state.placeIds.length).concat(state.buffer);
            state.placeIds.splice(state.placeIds.length - bufferSize, bufferSize);
        },
        swipe: (state) => {
            state.buffer.pop();
            if (state.placeIds.length > 0) {
                state.buffer.unshift(state.placeIds.pop());
                if (state.placeIds.length <= fetchOffset) {
                    state.needMoreData = true;
                }
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPlaceIds.pending, (state, action) => {
                state.placeIdStatus = 'loading';
            })
            .addCase(fetchPlaceIds.fulfilled, (state, action) => {
                state.nextPageToken = action.payload.next_page_token ? action.payload.next_page_token : null;
                if (state.pageSize > 0 && !state.nextPageToken) {
                    state.nearbySearchEndReached = true;
                }
                state.pageSize += action.payload.results.length;
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
                state.placeDetails = action.payload.result;
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
    addType,
    removeType,
    addKeyword,
    removeKeyword,
    openFilterModal,
    closeFilterModal,
    submitFilter,
    concatBuffer,
    swipe,
    setExploreLocation,
    setMapMarker,
    setRegion
} = exploreReducer.actions

export const selectRadius = state => state.explore.radius
export const selectType = state => state.explore.type
export const selectKeywords = state => state.explore.keywords
export const selectMinPrice = state => state.explore.minPrice
export const selectMaxPrice = state => state.explore.maxPrice
export const selectFilterModalVisible = state => state.explore.filterModalVisible
export const selectUnits = state => state.explore.units
export const selectPlaceIdStatus = state => state.explore.placeIdStatus
export const selectPlaceIdError = state => state.explore.placeIdError
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