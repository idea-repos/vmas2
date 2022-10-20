import { createSlice } from "@reduxjs/toolkit";
import { receiver } from "../../staticData";
import { apiCallBegan } from "../api";

interface InitialState {
    list : receiver[],
    lastFetch : null | string
}

const initialState : InitialState = {
    list : [],
    lastFetch: null
}

//Endpoint
const GET_URL_RECEIVER = 'api/dict/dict_mgmt/receiver'

const receiversSlice = createSlice({
    name: 'receivers',
    initialState,
    reducers: {
        receiversReceived : (receivers, action) => {
            receivers.list = action.payload;
        },
        receiverCreated : (receivers, action) => {
            receivers.list.push({
                id: action.payload.id,
                name: action.payload.name,
                created_at: action.payload.created_at
            })
        },
        receiverUpdated : (receivers, action) => {
            const index = receivers.list.findIndex(receiver => receiver.id == action.payload.id);
            receivers.list[index].name = action.payload.name
            receivers.list[index].created_at = action.payload.created_at
        },
        receiverDeleted : (receivers, action) => {
            receivers.list.filter(receiver => receiver.id != action.payload.id);
        }
    }
})

export default receiversSlice.reducer
export const {receiverCreated, receiverUpdated, receiverDeleted, receiversReceived} = receiversSlice.actions

//Action Creator
export const loadReceivers = () => apiCallBegan(GET_URL_RECEIVER, receiversReceived.type)