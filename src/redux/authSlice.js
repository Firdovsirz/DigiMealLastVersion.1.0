import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    username: '',
    token: null
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload || '';
      localStorage.setItem('username', action.payload || '');
    },
    clearUsername: (state) => {
      state.username = '';
      localStorage.removeItem('username');
    },
  },
});

export const { setUsername, clearUsername } = authSlice.actions;
export default authSlice.reducer;