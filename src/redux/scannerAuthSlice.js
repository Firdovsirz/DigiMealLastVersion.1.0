import { createSlice } from '@reduxjs/toolkit';

// Get the token from localStorage (if available) on initial load
const initialState = {
    scannerToken: localStorage.getItem('scannerToken') || null,
    isScannerAuthenticated: !!localStorage.getItem('scannerToken'),
};

const scannerAuthSlice = createSlice({
    name: 'scannerAuth',
    initialState,
    reducers: {
        setScannerToken: (state, action) => {
            state.scannerToken = action.payload;
            state.isScannerAuthenticated = !!action.payload;
            if (action.payload) {
                localStorage.setItem('scannerToken', action.payload); // Save to localStorage
            }
        },
        clearScannerToken: (state) => {
            // Clear the token from both Redux state and localStorage
            state.scannerToken = null;
            state.isScannerAuthenticated = false;
            localStorage.removeItem('scannerToken'); // Remove from localStorage
        },
    },
});

export const { setScannerToken, clearScannerToken } = scannerAuthSlice.actions;
export default scannerAuthSlice.reducer;
