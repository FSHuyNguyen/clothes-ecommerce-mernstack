import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  approvalURL: null,
  orderId: null,
  orderList: [],
  orderDetail: null,
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_NODEJS_PORT}/shop/order/create`,
      orderData
    );

    return response.data;
  }
);

export const captureNewOrder = createAsyncThunk(
  "/order/captureNewOrder",
  async ({ paymentId, payerId, orderId }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_NODEJS_PORT}/shop/order/capture`,
      {
        paymentId,
        payerId,
        orderId,
      }
    );

    return response.data;
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_NODEJS_PORT}/shop/order/list/${userId}`
    );
    return response.data;
  }
);

export const getOrderDetail = createAsyncThunk(
  "/order/getOrderDetail",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_NODEJS_PORT}/shop/order/detail/${id}`
    );

    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrder",
  initialState,
  reducers: {
    resetOrderDetail: (state) => {
      state.orderDetail = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.data.approvalURL;
        state.orderId = action.payload.data.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.data.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetail = action.payload.data;
      })
      .addCase(getOrderDetail.rejected, (state) => {
        state.isLoading = false;
        state.orderDetail = [];
      });
  },
});

export const { resetOrderDetail } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;
