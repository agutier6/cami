import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getPlaceDetails } from '../../services/googlePlaces/getPlaceDetails';
import { nearbySearchByProminence, nearbySearchWithNextPageToken } from '../../services/googlePlaces/nearbySearch';
import React from 'react';

export const bufferSize = 4;
export const undoAmount = 3;
const fetchOffset = 3;
const numTypes = 4;

// bufferSize must be greater than or equal to undoAmount

export const fetchRestaurants = createAsyncThunk('explore/fetchRestaurants', async (args, { getState }) => {
    const state = getState();

    if (state.explore.nextPageToken.restaurant) {
        const response = await nearbySearchWithNextPageToken(state.explore.location.latitude, state.explore.location.longitude, state.explore.radius, 'restaurant', '', state.explore.minPrice, state.explore.maxPrice, 'english', state.explore.nextPageToken.restaurant);
        return response.data;
    }

    const response = await nearbySearchByProminence(state.explore.location.latitude, state.explore.location.longitude, state.explore.radius, 'restaurant', '', state.explore.minPrice, state.explore.maxPrice, 'english');
    return response.data;
})
export const fetchBars = createAsyncThunk('explore/fetchBars', async (args, { getState }) => {
    const state = getState();

    if (state.explore.nextPageToken.bar) {
        const response = await nearbySearchWithNextPageToken(state.explore.location.latitude, state.explore.location.longitude, state.explore.radius, 'bar', '', state.explore.minPrice, state.explore.maxPrice, 'english', state.explore.nextPageToken.bar);
        return response.data;
    }

    const response = await nearbySearchByProminence(state.explore.location.latitude, state.explore.location.longitude, state.explore.radius, 'bar', '', state.explore.minPrice, state.explore.maxPrice, 'english');
    return response.data;
})
export const fetchCafes = createAsyncThunk('explore/fetchCafes', async (args, { getState }) => {
    const state = getState();

    if (state.explore.nextPageToken.cafe) {
        const response = await nearbySearchWithNextPageToken(state.explore.location.latitude, state.explore.location.longitude, state.explore.radius, 'cafe', '', state.explore.minPrice, state.explore.maxPrice, 'english', state.explore.nextPageToken.cafe);
        return response.data;
    }

    const response = await nearbySearchByProminence(state.explore.location.latitude, state.explore.location.longitude, state.explore.radius, 'cafe', '', state.explore.minPrice, state.explore.maxPrice, 'english');
    return response.data;
})
export const fetchNightclubs = createAsyncThunk('explore/fetchNightclubs', async (args, { getState }) => {
    const state = getState();

    if (state.explore.nextPageToken.nightclub) {
        const response = await nearbySearchWithNextPageToken(state.explore.location.latitude, state.explore.location.longitude, state.explore.radius, 'night_club', '', state.explore.minPrice, state.explore.maxPrice, 'english', state.explore.nextPageToken.nightclub);
        return response.data;
    }

    const response = await nearbySearchByProminence(state.explore.location.latitude, state.explore.location.longitude, state.explore.radius, 'night_club', '', state.explore.minPrice, state.explore.maxPrice, 'english');
    return response.data;
})

export const fetchPlaceDetails = createAsyncThunk('explore/fetchPlaceDetails', async (args, { getState }) => {
    const state = getState();
    if (state.explore.places.restaurants.length === 0
        && state.explore.places.bars.length === 0
        && state.explore.places.cafes.length === 0
        && state.explore.places.nightclubs.length === 0
        && state.explore.buffer.length - undoAmount - 1 < 0) {
        return -1;
    }
    const response = await getPlaceDetails(state.explore.buffer[state.explore.places.restaurants.length > 0 && state.explore.places.bars.length > 0 && state.explore.places.cafes.length > 0 && state.explore.places.nightclubs.length > 0 ? bufferSize - 1 : state.explore.buffer.length - undoAmount - 1].place_id);
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
        types: ["restaurant", "bar", "cafe", "night_club"],
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
        places: {
            restaurants: [],
            bars: [],
            cafes: [],
            nightclubs: []
        },
        placeStatus: {
            restaurant: 'idle',
            bar: 'idle',
            cafe: 'idle',
            nightclub: 'idle',
        },
        placeError: {
            restaurant: null,
            bar: null,
            cafe: null,
            nightclub: null,
        },
        placeDetails: null,
        nextPageToken: {
            restaurant: null,
            bar: null,
            cafe: null,
            nightclub: null,
        },
        placeIdStatus: 'idle',
        placeIdError: null,
        placeDetailsStatus: 'idle',
        placeDetailsError: null,
        needMoreData: {
            restaurant: false,
            bar: false,
            cafe: false,
            nightclub: false,
        },
        buffer: [],
        nearbySearchEndReached: {
            restaurant: false,
            bar: false,
            cafe: false,
            nightclub: false,
        },
        index: 0
    },
    reducers: {
        submitFilter: (state) => {
            state.places = {
                restaurants: [],
                bars: [],
                cafes: [],
                nightclubs: []
            };
            state.placeDetails = null;
            state.nextPageToken = {
                restaurant: null,
                bar: null,
                cafe: null,
                nightclub: null,
            };
            state.placeStatus = {
                restaurant: 'idle',
                bar: 'idle',
                cafe: 'idle',
                nightclub: 'idle',
            };
            state.placeError = {
                restaurant: null,
                bar: null,
                cafe: null,
                nightclub: null,
            };
            state.placeDetailsStatus = 'idle';
            state.placeDetailsError = null;
            state.needMoreData = {
                restaurant: false,
                bar: false,
                cafe: false,
                nightclub: false,
            };
            state.buffer = [];
            state.nearbySearchEndReached = {
                restaurant: false,
                bar: false,
                cafe: false,
                nightclub: false,
            };
            state.index = 0;
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
        setTypes: (state, action) => {
            state.types = action.payload
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
            // state.buffer = state.placeIds.slice(state.placeIds.length - bufferSize, state.placeIds.length).concat(state.buffer);
            // state.placeIds.splice(state.placeIds.length - bufferSize, bufferSize);
            let i = 0;
            for (let j = 0; j < bufferSize;) {
                switch (i % numTypes) {
                    case 0:
                        if (state.places.restaurants.length > 0) {
                            if (state.buffer.find(place => place.place_id === state.places.restaurants[state.places.restaurants.length - 1].place_id)) {
                                state.places.restaurants.pop();
                            } else {
                                state.buffer.unshift(state.places.restaurants.pop());
                                j++;
                            }
                            if (state.places.restaurants.length <= fetchOffset) {
                                state.needMoreData.restaurant = true;
                                console.log("restaurant need more data");
                            }
                        }
                        i++;
                        break;
                    case 1:
                        if (state.places.bars.length > 0) {
                            if (state.buffer.find(place => place.place_id === state.places.bars[state.places.bars.length - 1].place_id)) {
                                state.places.bars.pop();
                            } else {
                                state.buffer.unshift(state.places.bars.pop());
                                j++;
                            }
                            if (state.places.bars.length <= fetchOffset) {
                                state.needMoreData.bar = true;
                                console.log("bar need more data");
                            }
                        }
                        i++;
                        break;
                    case 2:
                        if (state.places.cafes.length > 0) {
                            if (state.buffer.find(place => place.place_id === state.places.cafes[state.places.cafes.length - 1].place_id)) {
                                state.places.cafes.pop();
                            } else {
                                state.buffer.unshift(state.places.cafes.pop());
                                j++;
                            }
                            if (state.places.cafes.length <= fetchOffset) {
                                state.needMoreData.cafe = true;
                                console.log("cafe need more data");
                            }
                        }
                        i++;
                        break;
                    case 3:
                        if (state.places.nightclubs.length > 0) {
                            if (state.buffer.find(place => place.place_id === state.places.nightclubs[state.places.nightclubs.length - 1].place_id)) {
                                state.places.nightclubs.pop();
                            } else {
                                state.buffer.unshift(state.places.nightclubs.pop());
                                j++;
                            }
                            if (state.places.nightclubs.length <= fetchOffset) {
                                state.needMoreData.nightclub = true;
                                console.log("club need more data");
                            }
                        }
                        i++;
                        break;
                }
            }
            console.log("buffer", state.buffer.map(i => i.name));
        },
        swipe: (state) => {
            if (state.buffer.length >= bufferSize + undoAmount ||
                (state.places.restaurants.length === 0
                    && state.places.bars.length === 0
                    && state.places.cafes.length === 0
                    && state.places.nightclubs.length === 0)) {
                state.buffer.pop();

            }
            // if (state.placeIds.length > 0) {
            //     state.buffer.unshift(state.placeIds.pop());
            //     if (state.placeIds.length <= fetchOffset) {
            //         state.needMoreData = true;
            //     }
            // }
            let loadToBuffer = false;
            while (!loadToBuffer) {
                switch (state.index % numTypes) {
                    case 0:
                        if (state.places.restaurants.length > 0) {
                            if (state.buffer.find(place => place.place_id === state.places.restaurants[state.places.restaurants.length - 1].place_id)) {
                                state.places.restaurants.pop();
                                state.index--;
                            } else {
                                state.buffer.unshift(state.places.restaurants.pop());
                                loadToBuffer = true;
                            }
                            if (state.places.restaurants.length <= fetchOffset) {
                                state.needMoreData.restaurant = true;
                                console.log("restaurant need more data");
                            }
                        }
                        state.index++;
                        break;
                    case 1:
                        if (state.places.bars.length > 0) {
                            if (state.buffer.find(place => place.place_id === state.places.bars[state.places.bars.length - 1].place_id)) {
                                state.places.bars.pop();
                            } else {
                                state.buffer.unshift(state.places.bars.pop());
                                loadToBuffer = true;
                            }
                            if (state.places.bars.length <= fetchOffset) {
                                state.needMoreData.bar = true;
                                console.log("bar need more data");
                            }
                        }
                        state.index++;
                        break;
                    case 2:
                        if (state.places.cafes.length > 0) {
                            if (state.buffer.find(place => place.place_id === state.places.cafes[state.places.cafes.length - 1].place_id)) {
                                state.places.cafes.pop();
                            } else {
                                state.buffer.unshift(state.places.cafes.pop());
                                loadToBuffer = true;
                            }
                            if (state.places.cafes.length <= fetchOffset) {
                                state.needMoreData.cafe = true;
                                console.log("cafe need more data");
                            }
                        }
                        state.index++;
                        break;
                    case 3:
                        if (state.places.nightclubs.length > 0) {
                            if (state.buffer.find(place => place.place_id === state.places.nightclubs[state.places.nightclubs.length - 1].place_id)) {
                                state.places.nightclubs.pop();
                            } else {
                                state.buffer.unshift(state.places.nightclubs.pop());
                                loadToBuffer = true;
                            }
                            if (state.places.nightclubs.length <= fetchOffset) {
                                state.needMoreData.nightclub = true;
                                console.log("club need more data");
                            }
                        }
                        state.index++;
                        break;
                }
            }
            console.log(state.buffer.map(i => i.name));
        },
        undo: (state) => {
            let temp = state.buffer.shift();
            switch (temp.category) {
                case "Restaurant":
                    console.log("rest")
                    state.places.restaurants.push(temp);
                    break;
                case "Bar":
                    console.log("bar")
                    state.places.bars.push(temp);
                    break;
                case "Cafe":
                    console.log("cafe")
                    state.places.cafes.push(temp);
                    break;
                case "Night Club":
                    console.log("nc")
                    state.places.nightclubs.push(temp);
                    break;
            }
            // state.placeIds.push(state.buffer.shift());
            state.buffer.push(null);
            state.index--;
            console.log(state.buffer.map(i => i ? i.name : "empty"));
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchRestaurants.pending, (state, action) => {
                state.placeStatus.restaurant = 'loading';
            })
            .addCase(fetchRestaurants.fulfilled, (state, action) => {
                state.nextPageToken.restaurant = action.payload.next_page_token ? action.payload.next_page_token : null;
                if (!state.nextPageToken.restaurant) {
                    state.nearbySearchEndReached.restaurant = true;
                    console.log("restaurant end reached");
                }
                state.places.restaurants = action.payload.results.map(result => {
                    return {
                        "place_id": result.place_id,
                        "name": result.name,
                        "rating": result.rating,
                        "user_ratings_total": result.user_ratings_total,
                        "price_level": result.price_level,
                        "photos": result.photos,
                        "category": "Restaurant"
                    }
                }).reverse().concat(state.places.restaurants);
                state.needMoreData.restaurant = false;
                state.placeStatus.restaurant = 'succeeded';
                console.log(state.places.restaurants.map(i => i.name));
            })
            .addCase(fetchRestaurants.rejected, (state, action) => {
                state.placeError.restaurant = action.error.message;
                state.placeStatus.restaurant = 'failed';
            })
            .addCase(fetchBars.pending, (state, action) => {
                state.placeStatus.bar = 'loading';
            })
            .addCase(fetchBars.fulfilled, (state, action) => {
                state.nextPageToken.bar = action.payload.next_page_token ? action.payload.next_page_token : null;
                if (!state.nextPageToken.bar) {
                    state.nearbySearchEndReached.bar = true;
                    console.log("bar end reached");
                }
                state.places.bars = action.payload.results.map(result => {
                    return {
                        "place_id": result.place_id,
                        "name": result.name,
                        "rating": result.rating,
                        "user_ratings_total": result.user_ratings_total,
                        "price_level": result.price_level,
                        "photos": result.photos,
                        "category": "Bar"
                    }
                }).reverse().concat(state.places.bars);
                state.needMoreData.bar = false;
                state.placeStatus.bar = 'succeeded';
                console.log(state.places.bars.map(i => i.name));
            })
            .addCase(fetchBars.rejected, (state, action) => {
                state.placeError.bar = action.error.message;
                state.placeStatus.bar = 'failed';
            })
            .addCase(fetchCafes.pending, (state, action) => {
                state.placeStatus.cafe = 'loading';
            })
            .addCase(fetchCafes.fulfilled, (state, action) => {
                state.nextPageToken.cafe = action.payload.next_page_token ? action.payload.next_page_token : null;
                if (!state.nextPageToken.cafe) {
                    state.nearbySearchEndReached.cafe = true;
                    console.log("cafe end reached");
                }
                state.places.cafes = action.payload.results.map(result => {
                    return {
                        "place_id": result.place_id,
                        "name": result.name,
                        "rating": result.rating,
                        "user_ratings_total": result.user_ratings_total,
                        "price_level": result.price_level,
                        "photos": result.photos,
                        "category": "Cafe"
                    }
                }).reverse().concat(state.places.cafes);
                state.needMoreData.cafe = false;
                state.placeStatus.cafe = 'succeeded';
                console.log(state.places.cafes.map(i => i.name));
            })
            .addCase(fetchCafes.rejected, (state, action) => {
                state.placeError.cafe = action.error.message;
                state.placeStatus.cafe = 'failed';
            })
            .addCase(fetchNightclubs.pending, (state, action) => {
                state.placeStatus.nightclub = 'loading';
            })
            .addCase(fetchNightclubs.fulfilled, (state, action) => {
                state.nextPageToken.nightclub = action.payload.next_page_token ? action.payload.next_page_token : null;
                if (!state.nextPageToken.nightclub) {
                    state.nearbySearchEndReached.nightclub = true;
                    console.log("club end reached");
                }
                state.places.nightclubs = action.payload.results.map(result => {
                    return {
                        "place_id": result.place_id,
                        "name": result.name,
                        "rating": result.rating,
                        "user_ratings_total": result.user_ratings_total,
                        "price_level": result.price_level,
                        "photos": result.photos,
                        "category": "Night Club"
                    }
                }).reverse().concat(state.places.nightclubs);
                state.needMoreData.nightclub = false;
                state.placeStatus.nightclub = 'succeeded';
                console.log(state.places.nightclubs.map(i => i.name));
            })
            .addCase(fetchNightclubs.rejected, (state, action) => {
                state.placeError.nightclub = action.error.message;
                state.placeStatus.nightclub = 'failed';
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
    setTypes,
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
    setRegion
} = exploreReducer.actions

export const selectRadius = state => state.explore.radius
export const selectTypes = state => state.explore.types
export const selectKeywords = state => state.explore.keywords
export const selectMinPrice = state => state.explore.minPrice
export const selectMaxPrice = state => state.explore.maxPrice
export const selectFilterModalVisible = state => state.explore.filterModalVisible
export const selectPlaceStatus = state => state.explore.placeStatus
export const selectPlaceError = state => state.explore.placeError
export const selectRestaurantLength = state => state.explore.places.restaurants.length
export const selectBarLength = state => state.explore.places.bars.length
export const selectCafeLength = state => state.explore.places.cafes.length
export const selectNightclubLength = state => state.explore.places.nightclubs.length
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