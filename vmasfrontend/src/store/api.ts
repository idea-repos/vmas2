import { createAction } from "@reduxjs/toolkit";

export const apiCallBegan = createAction('api/callBegan', function prepare(url: string, onSuccess:string) {
    return {
        payload: {
            url: url,
            onSuccess: onSuccess
        }
    }
})
export const apiCallSuccess = createAction('api/callSuccess')
export const apiCallFailed = createAction('api/callFailed')