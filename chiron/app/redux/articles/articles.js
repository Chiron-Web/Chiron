import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialArticlesState = {
  articles: [],
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
            setArticles(prev => [...prev, ...data.articles]);
            setHasMore(data.articles.length === pageSize);
        } else {
            setHasMore(false);
        }
        } catch (err) {
        console.error('Error fetching articles:', err);
        }
    }
);

export const articlesReducer = articlesSlice.reducer;