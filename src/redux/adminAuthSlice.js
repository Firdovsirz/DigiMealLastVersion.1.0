import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  isAuthenticated: false,
  token: null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setAdminAuth: (state, action) => {
      const { username, token } = action.payload;
      state.username = username;
      state.isAuthenticated = true;  // Set authentication to true when the token is set
      state.token = token;
    },
    clearAdminAuth: (state) => {
      state.username = null;
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { setAdminAuth, clearAdminAuth } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;