import { createSlice } from "@reduxjs/toolkit";
import { role } from "../types";
import { apiCallBegan } from './api';
import { METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT } from './http';

interface InitialState {
    list : role[],
    officerList: {id:string, username:string}[],
    lastFetch : null | string
}

const initialState: InitialState = {
    list : [],
    officerList: [],
    lastFetch: null
};

// Endpoint
const GET_URL_ROLE = 'api/roles'
const GET_OFFICER_ROLE = 'api/reportofficer'

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers:  {
        rolesReceived : (roles, action) => {
            roles.list = action.payload;
        },
        roleCreated : (roles, action) => {
            roles.list.push({
                id: action.payload.data.id,
                name: action.payload.data.name,
                users_count: action.payload.data.users_count,
                reports_to: action.payload.data.reports_to
            })
        },
        roleUpdated : (roles, action) => {
            const index = roles.list.findIndex(role => role.id == action.payload.data.id);
            roles.list[index].name = action.payload.data.name
            roles.list[index].users_count = action.payload.data.users_count
            roles.list[index].reports_to = action.payload.data.reports_to
        },
        roleDeleted : (roles, action) => {
            roles.list = roles.list.filter(role => role.id != action.payload.id);
        },
        officerByRoleReceived : (officers, action) => {
            officers.officerList = action.payload
        }
    }
});

export const {roleCreated, roleDeleted, roleUpdated, rolesReceived, officerByRoleReceived} = rolesSlice.actions;
export default rolesSlice.reducer

// Action Creator
export const loadRoles = () => apiCallBegan(GET_URL_ROLE, rolesReceived.type, METHOD_GET)
export const createRole = (data:any) => apiCallBegan(`${GET_URL_ROLE}/`, roleCreated.type, METHOD_POST, data)
export const updateRole = (id:number, data:any) => apiCallBegan(`${GET_URL_ROLE}/${id}/`, roleUpdated.type, METHOD_PUT, data)
export const deleteRole = (id:number) => apiCallBegan(`${GET_URL_ROLE}/${id}`, roleDeleted.type, METHOD_DELETE);
export const loadOfficerByRole = (id:number) => apiCallBegan(`${GET_OFFICER_ROLE}/${id}/`, officerByRoleReceived.type, METHOD_GET)