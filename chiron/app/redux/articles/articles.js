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
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      state.articles.push(...action.payload.articles);
      state.hasMore = action.payload.hasMore;
    });
  }
});

export const fetchArticles = createAsyncThunk(
    'articles/fetchArticles',
    async ( pageNum, fetchUrl ) => {
        try {
          const response = await fetch(`${fetchUrl}?page=${pageNum}&pageSize=${pageSize}`);
          const data = await response.json();

          if (data.success && data.articles.length > 0) {
            return {
              articles: data.articles,
              hasMore: data.articles.length === pageSize
            }  
          } 
          return { articles: [], hasMore: false };
        } catch (err) {
          console.error('Error fetching articles:', err);
        }
    }
);


export const articlesReducer = articlesSlice.reducer;