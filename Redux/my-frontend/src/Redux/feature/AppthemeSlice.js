import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  Apptheme: null
};

export const AppthemeSlice = createSlice({
  name: 'appthemeData',
  initialState,
  reducers: {
    setApptheme: (state, action) => {
      state.Apptheme = action.payload;
    },
  },
});

export const { setApptheme } = AppthemeSlice.actions;
export default AppthemeSlice.reducer;