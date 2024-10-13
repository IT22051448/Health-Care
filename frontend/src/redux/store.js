import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import appointReducer from "./appointSlice/appointSlice";
import doctorsReducer from "./docSlice/docSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["product"],
};

const reducer = combineReducers({
  auth: authReducer,
  appointments: appointReducer,
  doctors: doctorsReducer, 
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export const persistor = persistStore(store);
export default store;
