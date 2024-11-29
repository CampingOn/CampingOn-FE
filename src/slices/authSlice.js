import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accessToken: null,
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, user } = action.payload;
            state.accessToken = accessToken;
            state.isAuthenticated = true;
            state.user = user;
        },
        logout: (state) => {
            state.accessToken = null;
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
