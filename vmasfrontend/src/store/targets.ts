import { createSlice } from "@reduxjs/toolkit";
import { target } from "../components/TargetTable";
import { apiCallBegan } from './api';

interface InitialState {
    list : target[],
    lastFetch : null | string
}

const initialState : InitialState = {
    list : [],
    lastFetch: null
}

//Endpoint
const GET_URL_TARGETS = 'api/targets'

const targetsSlice = createSlice({
    name: 'targets',
    initialState,
    reducers: {
        targetsReceived : (targets, action) => {
            targets.list = action.payload;
        },
        targetCreated : (targets, action) => {
            targets.list.push({
                id: action.payload.id,
                name: action.payload.name,
                created_at: action.payload.created_at,
                notes: action.payload.notes,
                description: action.payload.description,
                details: action.payload.details,
            })
        },
        targetUpdated : (targets, action) => {
            const index = targets.list.findIndex(target => target.id == action.payload.id);
            targets.list[index].name = action.payload.name
            targets.list[index].created_at = action.payload.created_at
            targets.list[index].notes = action.payload.notes
            targets.list[index].description = action.payload.description
            targets.list[index].details = action.payload.details
        },
        targetDeleted : (targets, action) => {
            targets.list.filter(target => target.id != action.payload.id);
        }
    }
})

export default targetsSlice.reducer
export const {targetCreated, targetUpdated, targetDeleted, targetsReceived} = targetsSlice.actions

//Action Creator
export const loadTargets = () => apiCallBegan(GET_URL_TARGETS, targetsReceived.type)