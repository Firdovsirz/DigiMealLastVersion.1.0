import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from './authSlice';
import tokenReducer from './tokenSlice';
import adminAuthSlice from './adminAuthSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'token'],
};

const rootReducer = combineReducers({
    auth: authReducer,
    token: tokenReducer,
    adminAuth: adminAuthSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;