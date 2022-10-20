import { createSlice } from "@reduxjs/toolkit";
import { user } from '../components/UsersTable';
import { apiCallBegan } from './api';

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
const GET_USERS_URL = 'api/users/'

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        usersReceived : (users, action) => {
            users.list = action.payload;
        },
        userCreated : (users, action) => {
            users.list.push({
                id : action.payload.id,
                username: action.payload.username,
                role: action.payload.role,
                lastlogin: action.payload.lastlogin,
                status: action.payload.status,
                is_active: action.payload.is_active
            })
        },
        userUpdated : (users, action) => {
            const index = users.list.findIndex(user => user.id == action.payload.id);
            users.list[index].username = action.payload.username
            users.list[index].role = action.payload.role
            users.list[index].status = action.payload.status
            users.list[index].lastlogin = action.payload.lastlogin
            users.list[index].is_active = action.payload.is_active
        },
        userDeleted : (users, action) => {
            users.list.filter(user => user.id != action.payload.id)
        }
    }
})


export const {userCreated, userDeleted, userUpdated, usersReceived} = usersSlice.actions
export default usersSlice.reducer;

//Action Creators
export const loadUsers = () => apiCallBegan(GET_USERS_URL, usersReceived.type)