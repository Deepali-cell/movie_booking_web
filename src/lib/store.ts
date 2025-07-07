import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/app/serveces/app";
import { foodCourtApi } from "@/app/serveces/foodCourtApi";
import { theaterApi } from "@/app/serveces/theaterApi"; // << add this
import { movieApi } from "@/app/serveces/movieApi";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [foodCourtApi.reducerPath]: foodCourtApi.reducer,
    [theaterApi.reducerPath]: theaterApi.reducer,
    [movieApi.reducerPath]: movieApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(foodCourtApi.middleware)
      .concat(theaterApi.middleware)
      .concat(movieApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
