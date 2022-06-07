import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';

const initialState = {
  uid: '',
  name: '',
  email: '',
  status: '',
  block: '',
};

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // const result = await signInWithRedirect(auth, provider);
      return {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
      };
    } catch (error) {
      return {
        status: `No se pudo conectar... \n${error.message}`,
        uid: '',
        block: false,
      };
    }
  }
);

export const logoutFirebase = createAsyncThunk(
  'auth/logoutFirebase',
  async (payload) => {
    await signOut(auth);
    return payload;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {},
    logout: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginWithGoogle.pending, (state, action) => {
      state.status = 'Conectando con GOOGLE...';
      state.block = true;
    });
    builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
      // state = action.payload; // Don't work!
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });

      // state.uid = action.payload.uid;
      // state.name = action.payload.name;
      // state.email = action.payload.email;
      // state.status = action.payload.status;
      // state.block = action.payload.block;
    });
    builder.addCase(loginWithGoogle.rejected, (state, action) => {
      state.status = 'No se pudo conectar...';
      state.uid = '';
      state.block = false;
    });
    builder.addCase(logoutFirebase.fulfilled, (state, action) => {
      Object.keys(state).forEach((key) => {
        state[key] = '';
      });
      state.status = action.payload;
      state.block = false;
    });
    builder.addCase(logoutFirebase.rejected, (state, action) => {
      Object.keys(state).forEach((key) => {
        state[key] = '';
      });
      state.block = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { authMsgError } = authSlice.actions;

export default authSlice.reducer;
