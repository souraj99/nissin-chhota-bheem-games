import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { IpLookupData } from "../../interface";

export interface IpInfoSliceState extends IpLookupData {}

const initialState: IpInfoSliceState = {
  country: "",
  countryCode: "",
  regionName: "",
  region: "",
  city: "",
  zip: "",
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const ipInfoSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    setIpDetails: create.reducer(
      (state, action: PayloadAction<IpLookupData>) => {
        return { ...state, ...action.payload };
      }
    ),
    clearIpDetails: create.reducer(() => initialState),
  }),
});

// Action creators are generated for each case reducer function.
export const { clearIpDetails, setIpDetails } = ipInfoSlice.actions;
