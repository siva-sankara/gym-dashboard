import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice'
import locationReducer from '../slices/locationSlice'
import userReducer from '../slices/userSlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        location: locationReducer,
        user : userReducer
    }
});