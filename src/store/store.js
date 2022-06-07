import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authSlice';
import uiReducer from '../reducers/uiSlice';
import walletReducer from '../reducers/walletSlice';
import consoleReducer from '../reducers/consoleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    console: consoleReducer,
    wallet: walletReducer,
    ui: uiReducer,
  },
});
