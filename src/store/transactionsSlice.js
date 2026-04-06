import { createSlice } from "@reduxjs/toolkit";
import { mockTransactions } from '../data/mockData.js';

// Load initial state from localStorage or mock data 
const loadFromStorage = () => {
    const stored = localStorage.getItem("transactions");
    return stored ? JSON.parse(stored) : mockTransactions;
}


const initialState = {
    items: loadFromStorage(),
    searchQuery: "",
    filterType: "all",
    sortBy: "date",
    sortOrder: "desc",
};

const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        // Load data
        setTransactions(state, action) {
            state.items = action.payload;
        },

        // Add
        addTransaction(state, action) {
            const id =
                state.items.length > 0
                    ? Math.max(...state.items.map((t) => t.id)) + 1
                    : 1;

            state.items.push({ ...action.payload, id });
        },

        // Update
        updateTransaction(state, action) {
            const idx = state.items.findIndex(
                (t) => t.id === action.payload.id
            );
            if (idx !== -1) {
                state.items[idx] = action.payload;
            }
        },

        // Delete
        deleteTransaction(state, action) {
            state.items = state.items.filter(
                (t) => t.id !== action.payload
            );
        },

        // UI state
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        },

        setFilterType(state, action) {
            state.filterType = action.payload;
        },

        setSortBy(state, action) {
            state.sortBy = action.payload;
        },

        setSortOrder(state, action) {
            state.sortOrder = action.payload;
        },
    },
});

export const {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setTransactions,
    setSearchQuery,
    setFilterType,
    setSortBy,
    setSortOrder,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;