import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConfigState {
  isMenuOpen: boolean;
}

const initialState: ConfigState = {
  isMenuOpen: false,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setIsMenuOpen: (state, action: PayloadAction<ConfigState['isMenuOpen']>) => {
      state.isMenuOpen = action.payload;
    },
  },
});

export const {
  setIsMenuOpen,
} = configSlice.actions;

export default configSlice.reducer;
