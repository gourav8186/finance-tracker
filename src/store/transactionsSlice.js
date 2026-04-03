import { createSlice } from "@reduxjs/toolkit";
import { mockTransactions } from '../data/mockData.js';

// Load from localStorage or fallback
const loadFromStorage = () => {
    try {
        const data = localStorage.getItem("finance_transactions");
        return data ? JSON.parse(data) : mockTransactions;
    } catch {
        return mockTransactions;
    }
};

// Save to localStorage
const saveToStorage = (transactions) => {
    localStorage.setItem("finance_transactions", JSON.stringify(transactions))
};

// Initial state
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

        // Add transaction
        addTransaction(state, action) {
            const id = Math.max(0, ...state.items.map((t) => t.id)) + 1;
            state.items.push({ ...action.payload, id });
            saveToStorage(state.items);
        },

        // Update transaction
        updateTransaction(state, action) {
            const idx = state.items.findIndex((t) => t.id === action.payload.id);
            if (idx !== -1) {
                state.items[idx] = action.payload;
                saveToStorage(state.items);
            }
        },

        // Delete transaction
        deleteTransaction(state, action) {
            state.items = state.items.filter((t) => t.id !== action.payload);
            saveToStorage(state.items);
        },

        // UI states
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },

        setFilterType: (state, action) => {
            state.filterType = action.payload;
        },

        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },

        setSortOrder: (state, action) => {
            state.sortOrder = action.payload;
        },
    },
});

export const {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setSearchQuery,
    setFilterType,
    setSortBy,
    setSortOrder,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;