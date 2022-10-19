import { section } from "../components/SectionTable";
import { createSlice } from "@reduxjs/toolkit";

const initialState : section[] = []

const sectionsSlice = createSlice({
    name: 'sections',
    initialState,
    reducers: {
        sectionCreated : (sections, action) => {
            sections.push({
                id: action.payload.id,
                section_name: action.payload.section_name,
                section_desc: action.payload.section_desc,
                status: action.payload.status,
            })
        },
        sectionUpdated : (sections, action) => {
            const index = sections.findIndex(section => section.id == action.payload.id);
            sections[index].section_name = action.payload.section_name
            sections[index].section_desc = action.payload.section_desc
            sections[index].status = action.payload.status
        },
        sectionDeleted : (sections, action) => {
            sections.filter(section => section.id != action.payload.id);
        }
    }
})

export default sectionsSlice.reducer
export const {sectionCreated, sectionUpdated, sectionDeleted} = sectionsSlice.actions