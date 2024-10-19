import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_NODEJS_PORT}/shop/address/add/`,
      formData
    );

    return response.data;
  }
);

export const getAllAddress = createAsyncThunk(
  "/addresses/getAllAddress",
  async (userId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_NODEJS_PORT}/shop/address/get/${userId}`
    );

    return response.data;
  }
);

export const updateAddress = createAsyncThunk(
  "/addresses/updateAddress",
  async ({ userId, addressId, formData }) => {
    const response = await axios.put(
      `${
        import.meta.env.VITE_API_NODEJS_PORT
      }/shop/address/update/${userId}/${addressId}`,
      formData
    );

    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await axios.delete(
      `${
        import.meta.env.VITE_API_NODEJS_PORT
      }/shop/address/delete/${userId}/${addressId}`
    );

    return response.data;
  }
);

const addressSlice = createSlice({
  name: "shoppingAddress",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(addNewAddress.fulfilled, (state,action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
    })
    .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
    })
    .addCase(getAllAddress.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(getAllAddress.fulfilled, (state,action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
    })
    .addCase(getAllAddress.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
    })
    .addCase(updateAddress.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(updateAddress.fulfilled, (state,action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
    })
    .addCase(updateAddress.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
    })
    .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(deleteAddress.fulfilled, (state,action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
    })
    .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
    })
  },
});

export default addressSlice.reducer;
