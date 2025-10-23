import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialUrlState = {
    url: "",
    content: "",
    fetching: false,
};

const urlSlice = createSlice({
    name: "url",
    initialState: initialUrlState,
    reducers: {
        setUrl: (state, action) => {
            state.url = action.payload;
        },
        setContent: (state, action) => {
            state.content = action.payload;
        },
        setFetchingStatus: (state, action) => {
            state.fetching = action.payload;
        }
    },
    extraReducers: (builder) => {
      builder.addCase(scrapeContent.pending, (state) => {
        state.fetching = true;
      });
      builder.addCase(scrapeContent.fulfilled, (state, action) => {
        state.fetching = false;
        state.content = action.payload;
      });
    }
});

export const scrapeContent = createAsyncThunk(
  'url/scrapeContent',
  async (url) => {
    try {
      const response = await fetch('http://localhost:4000/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      console.log("Scraped: ", data)

      if (data.success && data.content) {
        setText(`${data.title || ''} ${data.content || ''}`);
        if (data.image) setArticleImage(data.image);
        if (data.credibilityScore) setArticleCredibilityScore(data.credibilityScore);
        if (data.title) setArticleTitle(data.title);
      } else {
        alert('Failed to extract content from the URL');
      }
    } catch (error) {
      console.error('Error scraping content:', error);
    }
  }
)

export const classifyContent = createAsyncThunk(
    'url/classifyContent',
    async (url) => {
      try {
        const response = await fetch('http://127.0.0.1:5000/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, url }),
        });

        if (!response.ok) {
          console.error('Error classifying article:', response.statusText);
          return {...data,
            image: null,
            credibilityScore: null,
            articleTitle: null
          };
        }
        const data = await response.json();
        console.log("Classification: ", data);

        // Include image and credibility in the result
        const enrichedResult = {
          ...data,
          image: articleImage,
          credibilityScore: articleCredibilityScore,
          articleTitle: articleTitle,
        };

        return enrichedResult;
      } catch (error) {
        console.error('Error during classification:', error);
      }
    }
);

export const { setUrl, setContent, setFetchingStatus } = urlSlice.actions;
export {scrapeContent};

export const urlReducer = urlSlice.reducer;
