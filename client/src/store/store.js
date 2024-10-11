import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductsReducer from "./admin/product-slice";
import ShoppingProductsReducer from "./shop/product-slice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProducts: AdminProductsReducer,
        shoppingProducts: ShoppingProductsReducer
    }
})

export default store;