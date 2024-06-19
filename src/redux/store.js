import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './user/userSlice';
import { persistReducer } from "redux-persist";
import { version } from "react";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
const rootReducer = combineReducers({user:userReducer});
const persistConfig = {
   key: 'root',
   storage,
   version:1,
} 
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
    reducer: persistedReducer,
     middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
  export const persistor = persistStore(store);