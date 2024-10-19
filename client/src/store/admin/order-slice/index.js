import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  orderList: [],
  orderDetail: null,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_NODEJS_PORT}/admin/orders/get`
    );
    return response.data;
  }
);

export const getOrderDetailForAdmin = createAsyncThunk(
  "/order/getOrderDetailForAdmin",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_NODEJS_PORT}/admin/orders/details/${id}`
    );

    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_NODEJS_PORT}/admin/orders/update/${id}`,
      {
        orderStatus,
      }
    );

    return response.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {
    resetOrderDetail: (state) => {
      state.orderDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetail = action.payload.data;
      })
      .addCase(getOrderDetailForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetail = [];
      });
  },
});

export const { resetOrderDetail } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
