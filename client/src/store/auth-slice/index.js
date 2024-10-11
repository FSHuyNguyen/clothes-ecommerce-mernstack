import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk('/auth/register', async(formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_NODEJS_PORT}/auth/register`,formData,{
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue('Unexpected error');
  }
})

export const loginUser = createAsyncThunk('/auth/login', async(formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_NODEJS_PORT}/auth/login`,formData,{
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue('Unexpected error');
  }
})

export const logoutUser = createAsyncThunk('/auth/logout', async() => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_NODEJS_PORT}/auth/logout`,
    {},
    {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
})

export const checkAuth = createAsyncThunk('/auth/check-auth', async() => {
  const response = await axios.get(`${import.meta.env.VITE_API_NODEJS_PORT}/auth/check-auth`,{
    withCredentials: true,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    }
  });
  return response.data;
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state,action) => {

    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(registerUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(registerUser.fulfilled, (state,action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = false;
    })
    .addCase(registerUser.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(loginUser.fulfilled, (state,action) => {
      state.isLoading = false;
      state.user = action.payload.success ? action.payload.user : null;
      state.isAuthenticated = action.payload.success;
    })
    .addCase(loginUser.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase(checkAuth.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(checkAuth.fulfilled, (state,action) => {
      state.isLoading = false;
      state.user = action.payload.success ? action.payload.user : null;
      state.isAuthenticated = action.payload.success;
    })
    .addCase(checkAuth.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase(logoutUser.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    })
  }
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
