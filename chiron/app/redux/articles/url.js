import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialUrlState = {
    url: "",
    textContent: "",
    fetching: false,
    classifying: false,
    classificationResult: null,
    scrapingResult: null,
    isLatestHealthNews: false,
};

const urlSlice = createSlice({
    name: "url",
    initialState: initialUrlState,
    reducers: {
        addUrl: (state, action) => {
            state.url = action.payload;
        },
        addContent: (state, action) => {
            state.textContent = action.payload;
        },
        setFetchingStatus: (state, action) => {
            state.fetching = action.payload;
        },
        setLatestHealthNews: (action) => {
            state.isLatestHealthNews = action.payload;
        }
    },
    extraReducers: (builder) => {
      builder.addCase(scrapeContent.pending, (state) => {
        state.fetching = true;
      });
      builder.addCase(scrapeContent.fulfilled, (state, action) => {
        state.fetching = false;
        state.textContent = action.payload.content;
        state.scrapingResult = action.payload;
      });

      builder.addCase(classifyContent.pending, (state) => {
        state.classifying = true;
      });
      builder.addCase(classifyContent.fulfilled, (state, action) => {
        state.classifying = false;
        state.classificationResult = action.payload;
      });
    }
});

const scrapeContent = createAsyncThunk(
  'url/scrapeContent',
  async (url) => {
    try {
      console.log("Scraping URL: ", url);
      const response = await fetch('http://localhost:4000/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      console.log("Scraped: ", data)

      if (data.success && data.content) {
        data.content = `${data.title || ''} ${data.content || ''}`;
        return data;
      } else {
        alert('Failed to extract content from the URL');
      }
    } catch (error) {
      console.error('Error scraping content:', error);
    }
  }
)

const classifyContent = createAsyncThunk(
  'url/classifyContent',
  async (text) => {
    try {
      console.log("Classifying content for:", text);

      const response = await fetch('http://127.0.0.1:5000/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.error('Error classifying article:', response.statusText);
        return {
          status: 'error',
          news_type: null,
          authenticity: null,
          authenticity_confidence: null,
        };
      }

      const data = await response.json();
      console.log("Classification result:", data);
      return data;
    } catch (error) {
      console.error('Error during classification:', error);
      throw error; // (important so rejected state triggers in Redux)
    }
  }
);

export const { addUrl, addContent, setFetchingStatus, setLatestHealthNews } = urlSlice.actions;
export {scrapeContent, classifyContent};

export const urlReducer = urlSlice.reducer;
