import { createSlice } from "@reduxjs/toolkit";
import { language } from "../../staticData";
import { apiCallBegan } from "../api";

interface InitialState {
    list : language[],
    lastFetch : null | string
}

const initialState : InitialState = {
    list : [],
    lastFetch: null
}

//Endpoint
const GET_URL_LANG = 'api/dict/dict_mgmt/language'

const languagesSlice = createSlice({
    name: 'languages',
    initialState,
    reducers: {
        languagesReceived : (languages, action) => {
            languages.list = action.payload;
        },
        languageCreated : (languages, action) => {
            languages.list.push({
                id: action.payload.id,
                name: action.payload.name,
                created_at: action.payload.created_at
            })
        },
        languageUpdated : (languages, action) => {
            const index = languages.list.findIndex(language => language.id == action.payload.id);
            languages.list[index].name = action.payload.name
            languages.list[index].created_at = action.payload.created_at
        },
        languageDeleted : (languages, action) => {
            languages.list.filter(language => language.id != action.payload.id);
        }
    }
})

export default languagesSlice.reducer
export const {languageCreated, languageUpdated, languageDeleted, languagesReceived} = languagesSlice.actions

//Action Creator
export const loadKeywords = () => apiCallBegan(GET_URL_LANG, languagesReceived.type)