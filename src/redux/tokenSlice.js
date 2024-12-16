import { createSlice } from '@reduxjs/toolkit';

const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        token: null,
        isAuthenticated: false,
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        clearToken: (state) => {
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;