import { configureStore } from "@reduxjs/toolkit";
import { articlesReducer } from "./articles/articles";
import { urlReducer } from "./articles/url";

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    url: urlReducer,
  },
});