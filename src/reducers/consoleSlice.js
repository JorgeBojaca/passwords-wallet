import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  lines: [],
};
const consoleSlice = createSlice({
  name: 'console',
  initialState,
  reducers: {
    clearConsole: (state, action) => {
      state.lines = state.lines.map((ln) => ({ ...ln, isHidden: true }));
    },
    addNewLinesDisp: (state, { payload }) => {
      /**
       *
       * @param {array} current Llinea actual al historial
       * @param  {...any} newLines Nuevas lineas para la consola (opcional)
       */
      const { config, newLines } = payload;
      if (config) {
        if (config.current) {
          const currLine = {
            content: config.current,
            toHistory: true,
            preLineTxt: config.preLineTxt,
            isHidden: config.isHidden,
          };
          state.lines = [...state.lines, currLine];
        }
      }
      if (newLines?.length > 0) {
        state.lines = [...state.lines, ...newLines];
      }
    },
  },
});

export const { addNewLinesDisp, clearConsole } = consoleSlice.actions;

export default consoleSlice.reducer;
