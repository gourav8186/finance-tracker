import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import transactionsReducer from "./transactionsSlice.js"
import roleReducer from "./roleSlice.js";

export const store = configureStore({
    reducer: {
        transactions: transactionsReducer, // transactions reducer
        role: roleReducer, // role reducer
    }
})

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector; 