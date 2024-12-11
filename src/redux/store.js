import authReducer from './authSlice';
import adminAuthReducer from './adminAuthSlice';
import { configureStore } from '@reduxjs/toolkit';

// Load username from localStorage if available
const persistedUsername = localStorage.getItem('username') || '';
const persistedAdminUsername = localStorage.getItem('adminUsername') || '';

const store = configureStore({
  reducer: {
    auth: authReducer, // Regular user authentication
    adminAuth: adminAuthReducer, // Admin authentication
  },
  preloadedState: {
    auth: {
      username: persistedUsername,
    },
    adminAuth: {
      username: persistedAdminUsername,
    },
  },
});

export default store;