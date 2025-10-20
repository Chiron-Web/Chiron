import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
    },
    incrementPage: (state) => {
      state.page += 1;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      state.articles.push(...action.payload.articles);
      state.hasMore = action.payload.hasMore;
      state.isArticleLoading = action.payload.isArticleLoading;
      console.log(`In extraReducers, fetched ${action.payload.articles.length} articles. Total now: ${state.articles.length}`);
    });
  }
});

export const fetchArticles = createAsyncThunk(
    'articles/fetchArticles',
    async ({ pageNum, fetchUrl, pageSize }) => {
      
        try {
          console.log(`Inside thunk: Fetching articles for page ${pageNum}: ${fetchUrl}?page=${pageNum}&pageSize=${pageSize}`);
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

// export action creators
export const { setHasMore, setIsArticleLoading, incrementPage, addArticles } = articlesSlice.actions;

// export thunk
export { fetchArticles };

export const articlesReducer = articlesSlice.reducer;