import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialArticlesState = {
  articles: [],
  hasMore: true,
};

const articlesSlice = createSlice({
  name: "articles",
  initialState: initialArticlesState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticles.fulfilled, (state, action) => {});
  }
});

export const fetchArticles = (pageNum, fetchUrl) = createAsyncThunk(
    'articles/fetchArticles',
    async ( pageNum, fetchUrl ) => {
        try {
          const response = await fetch(`${fetchUrl}?page=${pageNum}&pageSize=${pageSize}`);
          const data = await response.json();

          if (data.success && data.articles.length > 0) {
              articles.push(...data.articles);
              hasMore = data.articles.length === pageSize;
          } else {
              hasMore = false;
          }
        } catch (err) {
        console.error('Error fetching articles:', err);
        }
    }
);


export const articlesReducer = articlesSlice.reducer;