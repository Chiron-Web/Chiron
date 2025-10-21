import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialUrlState = {
    url: "",
    content: ""
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
        }
    }
});

export const scrapeContent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, url }),
      });

      if (!response.ok) throw new Error('Failed to classify');
      const data = await response.json();
      console.log("Classification: ", data);

      // Include image and credibility in the result
      const enrichedResult = {
        ...data,
        image: articleImage,
        credibilityScore: articleCredibilityScore,
        articleTitle: articleTitle,
      };

      setClassificationResult(enrichedResult);
      setSubmittedText(text);
      router.push('/results');
    } catch (error) {
      setClassificationResult({ news_type: 'error', error: error.message });
      setSubmittedText(text);
      router.push('/results');
    } finally {
      setLoading(false);
    }
  };

export const { setUrl, setContent } = urlSlice.actions;

export const urlReducer = urlSlice.reducer;
