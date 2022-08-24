import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userReducer';
import { postReducer } from './postReducer';


export const rootStore = configureStore({
    reducer: {
        userReducer,
        postReducer
    }
})

