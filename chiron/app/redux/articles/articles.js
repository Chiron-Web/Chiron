import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialArticlesState = {
  articles: [],
  hasMore: true,
  isArticleLoading: true,
  page: 1,
};

const articlesSlice = createSlice({
  name: "articles",
  initialState: initialArticlesState,
  reducers: {
    addArticles: (state, action) => {
      state.articles.push(...action.payload);
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setIsArticleLoading: (state, action) => {
      state.isArticleLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      addArticles(state, action.payload.articles);
      setHasMore(state, action.payload.hasMore);
      setIsArticleLoading(state, action.payload.isArticleLoading);
    });
  }
});

export const fetchArticles = createAsyncThunk(
    'articles/fetchArticles',
    async ( pageNum, fetchUrl, pageSize ) => {
        try {
          const response = await fetch(`${fetchUrl}?page=${pageNum}&pageSize=${pageSize}`);
          const data = await response.json();

          if (data.success && data.articles.length > 0) {
            return {
              articles: data.articles,
              hasMore: data.articles.length === pageSize,
              isArticleLoading: false
            }  
          } 
          return { articles: [], hasMore: false, isArticleLoading: false };
        } catch (err) {
          console.error('Error fetching articles:', err);
        }
    }
);


export const articlesReducer = articlesSlice.reducer;