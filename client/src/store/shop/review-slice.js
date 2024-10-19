import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk(
    "/review/addReview",
    async (formData, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_NODEJS_PORT}/shop/review/add`,
          formData
        );
  
        if (response.status !== 200) {
          return rejectWithValue(response.data);
        }
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data.message);
      }
    }
  );
  

export const getsReview = createAsyncThunk("/review/getsReview", async (id) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_NODEJS_PORT}/shop/review/${id}`
  );

  return response.data;
});

const reviewSlice = createSlice({
  name: "shoppingReview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(addReview.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getsReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getsReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getsReview.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
