import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetail: null,
};

export const getListFilteredProducts = createAsyncThunk(
  "/adminProducts/gelistfilteredproducts",
  async ({ filterParams, sortParams }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const response = await axios.get(
      `${import.meta.env.VITE_API_NODEJS_PORT}/shop/products/get?${query}`
    );

    return response?.data;
  }
);

export const getProductDetail = createAsyncThunk(
  "/adminProducts/getproductdetail",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_NODEJS_PORT}/shop/products/get/${id}`
    );

    return response?.data;
  }
);

const shopProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(getListFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(getProductDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetail = action.payload.data;
      })
      .addCase(getProductDetail.rejected, (state) => {
        state.isLoading = false;
        state.productDetail = null;
      });
  },
});

export const { setProductDetails } = shopProductSlice.actions;
export default shopProductSlice.reducer;
