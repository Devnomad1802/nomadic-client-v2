import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import { globalSlice } from "../slices";
import { api } from "./api";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["global"],
};

const reducer = combineReducers({
  global: globalSlice.reducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);
