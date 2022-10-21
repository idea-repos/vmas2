import { createAction } from "@reduxjs/toolkit";

export const apiCallBegan = createAction('api/callBegan', function prepare(url: string, onSuccess:string, method='get', data:any={}) {
    return {
        payload: {
            url: url,
            method:method,
            data:data,
            onSuccess: onSuccess
        }
    }
})
export const apiCallSuccess = createAction('api/callSuccess')
export const apiCallFailed = createAction('api/callFailed')