import { createSlice } from '@reduxjs/toolkit';

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    username: '',
  },
  reducers: {
    setAdminUsername: (state, action) => {
      state.username = action.payload || '';
      localStorage.setItem('adminUsername', action.payload || '');
    },
    clearAdminUsername: (state) => {
      state.username = '';
      localStorage.removeItem('adminUsername');
    },
  },
});

export const { setAdminUsername, clearAdminUsername } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;