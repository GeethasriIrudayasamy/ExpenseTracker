import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./ThemeRedux";
import authReducer from "./AuthRedux";
import expReducer from "./ExpenseRedux";

const store = configureStore({
    reducer: { auth: authReducer, exp: expReducer, theme: themeReducer },
});

export default store;
