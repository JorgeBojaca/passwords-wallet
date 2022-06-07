import { createSlice } from '@reduxjs/toolkit';

// const initialState = { backgroundColor: '#282c34', loader: false };

const initialState = { backgroundColor: '#000', loader: false };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setBackground: (state, action) => {
      state.backgroundColor = action.payload;
    },
    showLoader: (state) => {
      state.loader = true;
    },
    hideLoader: (state) => {
      state.loader = false;
    },
  },
});

export const { setBackground, showLoader, hideLoader } = uiSlice.actions;
export default uiSlice.reducer;
