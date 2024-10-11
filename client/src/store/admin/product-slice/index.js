import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_NODEJS_PORT}/admin/products/add`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data;
  }
);

export const updateNewProduct = createAsyncThunk(
    "/products/updatenewproduct",
    async ({ id, formData }) => {
      const response = await axios.put(
        `${import.meta.env.VITE_API_NODEJS_PORT}/admin/products/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      return response?.data;
    }
);

export const deleteNewProduct = createAsyncThunk(
    "/products/deletenewproduct",
    async (id) => {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_NODEJS_PORT}/admin/products/delete/${id}`);
  
      return response?.data;
    }
);

export const getListProduct = createAsyncThunk(
    "/adminProducts/getlist",
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_NODEJS_PORT}/admin/products/get`);
  
      return response?.data;
    }
);

export const getDetailProduct = createAsyncThunk(
    "/products/getdetailproduct",
    async (id) => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_NODEJS_PORT}/admin/products/detail/${id}`);
  
      return response?.data;
    }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListProduct.pending,(state) => {
        state.isLoading = true;
    })
    .addCase(getListProduct.fulfilled,(state,action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
    })
    .addCase(getListProduct.rejected,(state) => {
        state.isLoading = false;
        state.productList = [];
    })
  },
});

export default AdminProductsSlice.reducer;
