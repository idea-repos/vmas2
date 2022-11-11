import { createSlice } from "@reduxjs/toolkit";
import { region } from "../../staticData";
import { apiCallBegan } from "../api";

interface InitialState {
    list : region[],
    lastFetch : null | string
}

const initialState : InitialState = {
    list : [],
    lastFetch: null
}

//Endpoint
const GET_URL_REGION = 'api/dict/dict_mgmt/region'

const regionsSlice = createSlice({
    name: 'regions',
    initialState,
    reducers: {
        regionsReceived : (regions, action) => {
            regions.list = action.payload;
        },
        regionCreated : (regions, action) => {
            regions.list.push({
                id: action.payload.id,
                name: action.payload.name,
                sub_region: action.payload.sub_region,
                created_at: action.payload.created_at
            })
        },
        regionUpdated : (regions, action) => {
            const index = regions.list.findIndex(region => region.id == action.payload.id);
            regions.list[index].name = action.payload.name
            regions.list[index].created_at = action.payload.created_at
        },
        regionDeleted : (regions, action) => {
            regions.list.filter(region => region.id != action.payload.id);
        }
    }
})

export default regionsSlice.reducer
export const {regionCreated, regionUpdated, regionDeleted, regionsReceived} = regionsSlice.actions

//Action Creator
export const loadKeywords = () => apiCallBegan(GET_URL_REGION, regionsReceived.type)