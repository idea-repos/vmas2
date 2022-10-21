import { Middleware } from '@reduxjs/toolkit';
import axios from 'axios';
import * as actions from '../api';


export interface Action<T = any> {
    type: T,
    payload: any
  }

const api : Middleware = ({ getState, dispatch }) => next => async (action : Action) => {
    if (action.type !== actions.apiCallBegan.type)
        return next(action);

    next(action)
    const {url, method, data, onSuccess, onError} = action.payload;
    try {
        const response = await axios.request({
            baseURL: 'http://localhost:8000/',
            url : url,
            method : method,
            data : data
        });
        dispatch({type: onSuccess, payload: response.data})
    } catch (error) {
        dispatch({type: onError, payload: error})
    }
}

export default api;