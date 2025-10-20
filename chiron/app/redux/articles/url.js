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
})

export const { setUrl, setContent } = urlSlice.actions;

export const urlReducer = urlSlice.reducer;
