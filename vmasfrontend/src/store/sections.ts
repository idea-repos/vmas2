import { section } from "../components/SectionTable";
import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from './api';

interface InitialState {
    list : section[],
    lastFetch : null | string
}

const initialState : InitialState = {
    list : [],
    lastFetch: null
}

//Endpoint 
const GET_URL_SECTION = 'api/sections'

const sectionsSlice = createSlice({
    name: 'sections',
    initialState,
    reducers: {
        sectionsReceived : (sections, action) => {
            sections.list = action.payload;
        },
        sectionCreated : (sections, action) => {
            sections.list.push({
                id: action.payload.id,
                section_name: action.payload.section_name,
                section_desc: action.payload.section_desc,
                status: action.payload.status,
            })
        },
        sectionUpdated : (sections, action) => {
            const index = sections.list.findIndex(section => section.id == action.payload.id);
            sections.list[index].section_name = action.payload.section_name
            sections.list[index].section_desc = action.payload.section_desc
            sections.list[index].status = action.payload.status
        },
        sectionDeleted : (sections, action) => {
            sections.list.filter(section => section.id != action.payload.id);
        }
    }
})

export default sectionsSlice.reducer
export const {sectionCreated, sectionUpdated, sectionDeleted, sectionsReceived} = sectionsSlice.actions

//Action Creator
export const loadSections = () => apiCallBegan(GET_URL_SECTION, sectionsReceived.type)