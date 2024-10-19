import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductsReducer from "./admin/product-slice";
import AdminOrderReducer from "./admin/order-slice";
import ShoppingProductsReducer from "./shop/product-slice";
import ShoppingCartsReducer from "./shop/cart-slice";
import ShoppingAddressReducer from "./shop/address-slice";
import ShoppingOrderReducer from "./shop/order-slice";
import ShoppingSearchReducer from "./shop/search-slice";
import ShoppingReviewReducer from "./shop/review-slice";
import CommonFeatureReducer from "./common/common-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProducts: AdminProductsReducer,
    adminOrder: AdminOrderReducer,

    shoppingProducts: ShoppingProductsReducer,
    shoppingCart: ShoppingCartsReducer,
    shoppingAddress: ShoppingAddressReducer,
    shoppingOrder: ShoppingOrderReducer,
    shoppingSearch: ShoppingSearchReducer,
    shoppingReview: ShoppingReviewReducer,
    commonFeatureImage: CommonFeatureReducer,
  },
});

export default store;
