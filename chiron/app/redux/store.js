import { configureStore } from "@reduxjs/toolkit";
import { articlesReducer } from "./articles/articles";

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
  },
});