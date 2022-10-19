import { createSlice } from "@reduxjs/toolkit";
import { target } from "../components/TargetTable";

const initialState : target[] = []

const targetsSlice = createSlice({
    name: 'targets',
    initialState,
    reducers: {
        targetCreated : (targets, action) => {
            targets.push({
                id: action.payload.id,
                name: action.payload.name,
                created_at: action.payload.created_at,
                notes: action.payload.notes,
                description: action.payload.description,
                details: action.payload.details,
            })
        },
        targetUpdated : (targets, action) => {
            const index = targets.findIndex(target => target.id == action.payload.id);
            targets[index].name = action.payload.name
            targets[index].created_at = action.payload.created_at
            targets[index].notes = action.payload.notes
            targets[index].description = action.payload.description
            targets[index].details = action.payload.details
        },
        targetDeleted : (targets, action) => {
            targets.filter(target => target.id != action.payload.id);
        }
    }
})

export default targetsSlice.reducer
export const {targetCreated, targetUpdated, targetDeleted} = targetsSlice.actions