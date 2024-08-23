import { configureStore } from "@reduxjs/toolkit";
import itemsReducer from "./slices/itemsSlice";

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    loading: (state = false, action) => {
      switch (action.type) {
        case "SET_LOADING":
          return action.payload;
        default:
          return state;
      }
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
