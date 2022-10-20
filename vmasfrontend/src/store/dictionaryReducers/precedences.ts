import { createSlice } from "@reduxjs/toolkit";
import { precedence } from "../../staticData";
import { apiCallBegan } from "../api";


interface InitialState {
    list : precedence[],
    lastFetch : null | string
}

const initialState : InitialState = {
    list : [],
    lastFetch: null
}

//Endpoint
const GET_URL_PRECEDENCE = 'api/dict/dict_mgmt/precedence'

const precedencesSlice = createSlice({
    name: 'precedences',
    initialState,
    reducers: {
        precedencesReceived : (precedences, action) => {
            precedences.list = action.payload;
        },
        precedenceCreated : (precedences, action) => {
            precedences.list.push({
                id: action.payload.id,
                name: action.payload.name,
                created_at: action.payload.created_at
            })
        },
        precedenceUpdated : (precedences, action) => {
            const index = precedences.list.findIndex(precedence => precedence.id == action.payload.id);
            precedences.list[index].name = action.payload.name
            precedences.list[index].created_at = action.payload.created_at
        },
        precedenceDeleted : (precedences, action) => {
            precedences.list.filter(precedence => precedence.id != action.payload.id);
        }
    }
})

export default precedencesSlice.reducer
export const {precedenceCreated, precedenceUpdated, precedenceDeleted, precedencesReceived} = precedencesSlice.actions

//Action Creator
export const loadPrecedences = () => apiCallBegan(GET_URL_PRECEDENCE, precedencesReceived.type)