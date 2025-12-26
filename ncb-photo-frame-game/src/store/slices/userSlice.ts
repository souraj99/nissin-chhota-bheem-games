import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserSliceState {
  name: string;
  email: string;
  mobile: string;
}

const initialState: UserSliceState = {
  name: "",
  mobile: "",
  email: "",
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    setUserDetails: create.reducer(
      (state, action: PayloadAction<UserSliceState>) => ({
        ...state,
        ...action.payload,
      })
    ),
    clearUserDetails: create.reducer(() => initialState),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    getUserDetails: (state) => state,
  },
});

// Action creators are generated for each case reducer function.
export const { setUserDetails, clearUserDetails } = userSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { getUserDetails } = userSlice.selectors;
