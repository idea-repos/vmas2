import { createSlice } from "@reduxjs/toolkit";
import { category } from "../../staticData";
import { apiCallBegan } from "../api";

interface InitialState {
    list : category[],
    lastFetch : null | string
}

const initialState : InitialState = {
    list : [],
    lastFetch: null
}

//Endpoint
const GET_URL_CATEGORY = 'api/dict/dict_mgmt/category'

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        categoriesReceived : (category, action) => {
            category.list = action.payload;
        },
        categoryCreated : (category, action) => {
            category.list.push({
                id: action.payload.id,
                name: action.payload.name,
                created_at: action.payload.created_at
            })
        },
        categoryUpdated : (category, action) => {
            const index = category.list.findIndex(category => category.id == action.payload.id);
            category.list[index].name = action.payload.name
            category.list[index].created_at = action.payload.created_at
        },
        categoryDeleted : (category, action) => {
            category.list.filter(cat => cat.id != action.payload.id);
        }
    }
})

export default categorySlice.reducer
export const {categoryCreated, categoryUpdated, categoryDeleted, categoriesReceived} = categorySlice.actions

//Action Creator
export const loadCategories = () => apiCallBegan(GET_URL_CATEGORY, categoriesReceived.type)