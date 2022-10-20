import { createSlice } from "@reduxjs/toolkit";
import { speaker } from "../../staticData";
import { apiCallBegan } from "../api";

interface InitialState {
    list : speaker[],
    lastFetch : null | string
}

const initialState : InitialState = {
    list : [],
    lastFetch: null
}

//Endpoint
const GET_URL_SPEAKER = 'api/dict/dict_mgmt/speaker'

const speakersSlice = createSlice({
    name: 'speakers',
    initialState,
    reducers: {
        speakersReceived : (speakers, action) => {
            speakers.list = action.payload;
        },
        speakerCreated : (speakers, action) => {
            speakers.list.push({
                id: action.payload.id,
                name: action.payload.name,
                created_at: action.payload.created_at
            })
        },
        speakerUpdated : (speakers, action) => {
            const index = speakers.list.findIndex(speaker => speaker.id == action.payload.id);
            speakers.list[index].name = action.payload.name
            speakers.list[index].created_at = action.payload.created_at
        },
        speakerDeleted : (speakers, action) => {
            speakers.list.filter(speaker => speaker.id != action.payload.id);
        }
    }
})

export default speakersSlice.reducer
export const {speakerCreated, speakerUpdated, speakerDeleted, speakersReceived} = speakersSlice.actions

//Action Creator
export const loadSources = () => apiCallBegan(GET_URL_SPEAKER, speakersReceived.type)