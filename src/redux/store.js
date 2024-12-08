import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Load username from localStorage if available
const persistedUsername = localStorage.getItem('username') || '';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      username: persistedUsername,
    },
  },
});

export default store;