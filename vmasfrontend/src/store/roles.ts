import { createSlice } from "@reduxjs/toolkit";
import { role } from "../components/RoleTable";

const initialState: role[] = [];

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers:  {
        roleCreated : (roles, action) => {
            roles.push({
                id: action.payload.id,
                name: action.payload.name,
                users_count: action.payload.users_count,
                reports_to: action.payload.reports_to
            })
        },
        roleUpdated : (roles, action) => {
            const index = roles.findIndex(role => role.id == action.payload.id);
            roles[index].name = action.payload.name
            roles[index].users_count = action.payload.users_count
            roles[index].reports_to = action.payload.reports_to
        },
        roleDeleted : (roles, action) => {
            roles.filter(role => role.id != action.payload.id);
        }
    }
});

export const {roleCreated, roleDeleted, roleUpdated} = rolesSlice.actions;
export default rolesSlice.reducer
