import { createSlice } from "@reduxjs/toolkit";
import { role } from "../components/RoleTable";
import { apiCallBegan } from './api';

interface InitialState {
    list : role[],
    lastFetch : null | string
}

const initialState: InitialState = {
    list : [],
    lastFetch: null
};

// Endpoint
const GET_URL_ROLE = 'api/roles'

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers:  {
        rolesReceived : (roles, action) => {
            roles.list = action.payload;
        },
        roleCreated : (roles, action) => {
            roles.list.push({
                id: action.payload.id,
                name: action.payload.name,
                users_count: action.payload.users_count,
                reports_to: action.payload.reports_to
            })
        },
        roleUpdated : (roles, action) => {
            const index = roles.list.findIndex(role => role.id == action.payload.id);
            roles.list[index].name = action.payload.name
            roles.list[index].users_count = action.payload.users_count
            roles.list[index].reports_to = action.payload.reports_to
        },
        roleDeleted : (roles, action) => {
            roles.list.filter(role => role.id != action.payload.id);
        }
    }
});

export const {roleCreated, roleDeleted, roleUpdated, rolesReceived} = rolesSlice.actions;
export default rolesSlice.reducer

// Action Creator
export const loadRoles = () => apiCallBegan(GET_URL_ROLE, rolesReceived.type)