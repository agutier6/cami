import { createSlice } from '@reduxjs/toolkit'

export const exploreFilterReducer = createSlice({
    name: 'exploreFilter',
    initialState: {
        radius: 500,
        type: ['restaurant'],
        keywords: [],
        minPrice: 1,
        maxPrice: 4,
        filterModalVisible: false,
        units: true //true is miles false is km
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
} = exploreFilterReducer.actions

export const selectRadius = state => state.exploreFilter.radius
export const selectType = state => state.exploreFilter.type
export const selectKeywords = state => state.exploreFilter.keywords
export const selectMinPrice = state => state.exploreFilter.minPrice
export const selectMaxPrice = state => state.exploreFilter.maxPrice
export const selectFilterModalVisible = state => state.exploreFilter.filterModalVisible
export const selectUnits = state => state.exploreFilter.units

export default exploreFilterReducer.reducer