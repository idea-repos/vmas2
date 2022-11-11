import { createSlice } from "@reduxjs/toolkit";
import { source } from "../../staticData";
import { apiCallBegan } from "../api";

interface InitialState {
    list : source[],
    lastFetch : null | string
}

const initialState : InitialState = {
    list : [],
    lastFetch: null
}

//Endpoint
const GET_URL_SOURCE = 'api/dict/dict_mgmt/source'

const sourcesSlice = createSlice({
    name: 'sources',
    initialState,
    reducers: {
        sourcesReceived : (sources, action) => {
            sources.list = action.payload;
        },
        sourceCreated : (sources, action) => {
            sources.list.push({
                id: action.payload.id,
                source: action.payload.source,
                alias: action.payload.alias,
                intercept_on: action.payload.intercept_on
            })
        },
        sourceUpdated : (sources, action) => {
            const index = sources.list.findIndex(source => source.id == action.payload.id);
            sources.list[index].source = action.payload.source
            sources.list[index].alias = action.payload.alias
            sources.list[index].intercept_on = action.payload.intercept_on
        },
        sourceDeleted : (sources, action) => {
            sources.list.filter(source => source.id != action.payload.id);
        }
    }
})

export default sourcesSlice.reducer
export const {sourceCreated, sourceUpdated, sourceDeleted, sourcesReceived} = sourcesSlice.actions

//Action Creator
export const loadSources = () => apiCallBegan(GET_URL_SOURCE, sourcesReceived.type)