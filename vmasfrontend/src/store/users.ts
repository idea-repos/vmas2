import { createSlice } from "@reduxjs/toolkit";
import { user } from "../types";
import { apiCallBegan } from './api';
import { METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT } from "./http";

export interface userDetail {
    username:string, 
    is_active:boolean, 
    reporting_officer:string, 
    group:string
}

interface InitialState {
    list : user[],
    userDetail: userDetail,
    lastFetch : null | string
}

const initialState : InitialState = {
    list : [],
    userDetail: {username:'', is_active:true, reporting_officer:'', group:''},
    // will work on caching here
    lastFetch: null
}

// Endpoints
const GET_USERS_URL = 'api/users'

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        usersReceived : (users, action) => {
            users.list = action.payload.map((user : user) => {
                user.status = user.status ? 'active' : 'inactive'
                return user
            }) 
        },
        userCreated : (users, action) => {
            users.list.push({
                id : action.payload.user_data.id,
                username: action.payload.user_data.username,
                role: action.payload.user_data.role,
                lastlogin: action.payload.user_data.lastlogin,
                status: action.payload.user_data.status,
                is_active: action.payload.user_data.is_active
            })
        },
        userUpdated : (users, action) => {
            const index = users.list.findIndex(user => user.id == action.payload.user_data.id);
            users.list[index].username = action.payload.user_data.username
            users.list[index].role = action.payload.user_data.role
            users.list[index].status = action.payload.user_data.status
            users.list[index].lastlogin = action.payload.user_data.lastlogin
            users.list[index].is_active = action.payload.user_data.is_active
        },
        userDeleted : (users, action) => {
            users.list = users.list.filter(user => user.id != action.payload.id);
        },
        userDetails : (user, action) => {
            user.userDetail.username = action.payload.username
            user.userDetail.is_active = action.payload.is_active
            user.userDetail.reporting_officer = action.payload.reporting_officer
            user.userDetail.group = action.payload.group
        }
    }
})


export const {userCreated, userDeleted, userUpdated, usersReceived, userDetails} = usersSlice.actions
export default usersSlice.reducer;

//Action Creators
export const loadUsers = () => apiCallBegan(GET_USERS_URL, usersReceived.type, METHOD_GET)
export const deleteUser = (id:number, hardDelete:boolean) => apiCallBegan(`${GET_USERS_URL}/${id}`, userDeleted.type, METHOD_DELETE, {hard_delete:hardDelete})
export const createUser = (data: any) => apiCallBegan(`${GET_USERS_URL}/`, userCreated.type, METHOD_POST, data)
export const updateUser = (id:number, data:any) => apiCallBegan(`${GET_USERS_URL}/${id}/`, userUpdated.type, METHOD_PUT, data)
export const userDetailed = (id: number) => apiCallBegan(`${GET_USERS_URL}/${id}`, userDetails.type, METHOD_GET)