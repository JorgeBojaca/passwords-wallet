import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { child, get, push, ref, set, remove } from 'firebase/database';
import { auth, database } from '../firebase/firebase';
import { logoutFirebase } from './authSlice';
import { hideLoader, showLoader } from './uiSlice';

const initialState = {
  apps: [],
};

export const fetchApps = createAsyncThunk(
  'wallet/fetchApps',
  async (payload, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `wallet/${payload}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const apps = Object.keys(data).map((id) => {
          return { ...data[id], id };
        });
        thunkAPI.dispatch(hideLoader());

        return apps;
      } else {
        console.log('Nothing found');
        thunkAPI.dispatch(hideLoader());
        return [];
      }
    } catch (e) {
      thunkAPI.dispatch(logoutFirebase('Error inesperado!'));
      thunkAPI.dispatch(hideLoader());
      return [];
    }

    // const OrderAppsRef = query(
    //   ref(database, 'wallet/' + auth.currentUser.uid),
    //   orderByChild('name')
    // );
    // onValue(OrderAppsRef, (snap) => { //Se actualiza con cada inserción en firebase
    //   snap.forEach((app) => {
    //     console.log(app.val());
    //   });
    // });
  }
);

export const saveApp = createAsyncThunk(
  'wallet/saveApp',
  async ({ name, value }) => {
    const appListRef = ref(database, `wallet/${auth.currentUser.uid}`);
    const newAppRef = push(appListRef);
    await set(newAppRef, {
      name,
      value,
    });
    return { name, value };
  }
);

export const removeApp = createAsyncThunk(
  'wallet/removeApp',
  async (payload) => {
    const appRef = ref(database, `wallet/${auth.currentUser.uid}/${payload}`);
    await remove(appRef);
    return payload;
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchApps.fulfilled, (state, action) => {
      state.apps = action.payload;
    });
    builder.addCase(fetchApps.rejected, (state, action, p) => {
      console.log('Error!', action.error, action);
    });
    builder.addCase(saveApp.fulfilled, (state, action) => {
      state.apps = [...state.apps, { ...action.payload }];
    });
    builder.addCase(saveApp.rejected, (state, action) => {
      console.log('Error!', action.error);
    });
    builder.addCase(removeApp.fulfilled, (state, action) => {
      state.apps = state.apps.filter((app) => app.id !== action.payload);
    });
    builder.addCase(removeApp.rejected, (state, action) => {
      console.log('No se pudo eliminar!', action.error);
    });
  },
});

export const { setApps } = walletSlice.actions;
export default walletSlice.reducer;
