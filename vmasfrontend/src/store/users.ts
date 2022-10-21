import { createSlice } from "@reduxjs/toolkit";
import { user } from '../components/UsersTable';
import { apiCallBegan } from './api';
import { useSelector } from 'react-redux';

interface InitialState {
    list : user[],
    lastFetch : null | string
}

const initialState : InitialState = {
    list : [],
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
        }
    }
})


export const {userCreated, userDeleted, userUpdated, usersReceived} = usersSlice.actions
export default usersSlice.reducer;

//Action Creators
export const loadUsers = () => apiCallBegan(GET_USERS_URL, usersReceived.type)
export const deleteUser = (id:number, hardDelete:boolean) => apiCallBegan(`${GET_USERS_URL}/${id}`, userDeleted.type, 'delete', {hard_delete:hardDelete})
export const createUser = (data: any) => apiCallBegan(`${GET_USERS_URL}/`, userCreated.type, 'post', data)
export const updateUser = (id:number, data:any) => apiCallBegan(`${GET_USERS_URL}/${id}/`, userUpdated.type, 'put', data)