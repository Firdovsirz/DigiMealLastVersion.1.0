import { createSlice } from '@reduxjs/toolkit';

// Initial state for super admin authentication
const initialState = {
  username: null,  // Store the username of the super admin
  isAuthenticated: false,  // Store authentication status
  token: null,  // Store the authentication token
};

// Create a slice to handle super admin authentication state
const superAdminAuthSlice = createSlice({
  name: 'superAdminAuth',
  initialState,
  reducers: {
    // Action to set the super admin authentication information (username and token)
    setSuperAdminAuth: (state, action) => {
      const { username, token } = action.payload;
      state.username = username;
      state.isAuthenticated = true;
      state.token = token;  // Set the token
    },

    // Action to clear the super admin authentication information
    clearSuperAdminAuth: (state) => {
      state.username = null;
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

// Export actions to be dispatched
export const { setSuperAdminAuth, clearSuperAdminAuth } = superAdminAuthSlice.actions;

// Export the reducer to be used in the Redux store
export default superAdminAuthSlice.reducer;
