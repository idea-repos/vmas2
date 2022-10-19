import { createSlice } from "@reduxjs/toolkit";
import { user } from '../components/UsersTable';

const initialState : user[] = []

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        userCreated : (users, action) => {
            users.push({
                id : action.payload.id,
                username: action.payload.username,
                role: action.payload.role,
                lastlogin: action.payload.lastlogin,
                status: action.payload.status,
                is_active: action.payload.is_active
            })
        },
        userUpdated : (users, action) => {
            const index = users.findIndex(user => user.id == action.payload.id);
            users[index].username = action.payload.username
            users[index].role = action.payload.role
            users[index].status = action.payload.status
            users[index].lastlogin = action.payload.lastlogin
            users[index].is_active = action.payload.is_active
        },
        userDeleted : (users, action) => {
            users.filter(user => user.id != action.payload.id)
        }
    }
})


export const {userCreated, userDeleted, userUpdated} = usersSlice.actions
export default usersSlice.reducer;
