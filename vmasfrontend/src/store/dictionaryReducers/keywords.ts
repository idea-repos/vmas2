import { createSlice } from "@reduxjs/toolkit";
import { keyword } from "../../staticData";
import { apiCallBegan } from "../api";

interface InitialState {
    list : keyword[],
    lastFetch : null | string
}

const initialState : InitialState = {
    list : [],
    lastFetch: null
}

//Endpoint
const GET_URL_KEYWORD = 'api/dict/dict_mgmt/keyword'

const keywordsSlice = createSlice({
    name: 'keywords',
    initialState,
    reducers: {
        keywordsReceived : (keywords, action) => {
            keywords.list = action.payload;
        },
        keywordCreated : (keywords, action) => {
            keywords.list.push({
                id: action.payload.id,
                name: action.payload.name,
                created_at: action.payload.created_at
            })
        },
        keywordUpdated : (keywords, action) => {
            const index = keywords.list.findIndex(keyword => keyword.id == action.payload.id);
            keywords.list[index].name = action.payload.name
            keywords.list[index].created_at = action.payload.created_at
        },
        keywordDeleted : (keywords, action) => {
            keywords.list.filter(keyword => keyword.id != action.payload.id);
        }
    }
})

export default keywordsSlice.reducer
export const {keywordCreated, keywordUpdated, keywordDeleted, keywordsReceived} = keywordsSlice.actions

//Action Creator
export const loadKeywords = () => apiCallBegan(GET_URL_KEYWORD, keywordsReceived.type)