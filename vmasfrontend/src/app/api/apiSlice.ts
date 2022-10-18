import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from '../../store/auth/authSlice';

interface RootState {
    auth : {user: string | null, token:string | null}
}

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8000',
    credentials : 'include',
    prepareHeaders : (headers, { getState }) => {
        const token = (getState() as RootState).auth.token
        headers.set('Content-Type', "application/json")
        headers.set('Accept', 'application/json')
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers;
    }
})

const baseQueryWithReauth = async (args : FetchArgs | string , api : BaseQueryApi, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) {
        console.log('sending refresh token');
        // send refresh token and get new access token 
        const refreshResult = await baseQuery('/token/refresh/', api, extraOptions);
        console.log(refreshResult);

        if (refreshResult?.data) {
            const user = (api.getState() as RootState).auth.user;
            //store the new token
            api.dispatch(setCredentials({...(refreshResult.data as Record<string, unknown>), user}));
            //retry the original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut({}))
        }
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery : baseQueryWithReauth,
    endpoints: builder => ({})
})