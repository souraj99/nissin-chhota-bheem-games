import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { userSlice } from "./slices/userSlice";
import { authSlice } from "./slices/authSlice";
import { ipInfoSlice } from "./slices/ipInfoSlice";

const persistConfig = {
  key: "root",
  storage,
};

const reducer = combineReducers({
  auth: authSlice.reducer,
  user: userSlice.reducer,
  ipInfo: ipInfoSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: import.meta.env.DEV,
});

persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
