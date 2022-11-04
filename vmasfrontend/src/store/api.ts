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
// generic (common) action for flash message on success on pending
export const apiCallSuccess = createAction('api/callSuccess')
// generic (common) action for flash message on failed on pending
export const apiCallFailed = createAction('api/callFailed')