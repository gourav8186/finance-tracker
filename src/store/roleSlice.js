import { createSlice } from "@reduxjs/toolkit";

// Initial role state
const initialState = {
    current: "admin"
};

const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {
        // Update role
        setRole: (state, action) => {
            state.current = action.payload;
        }
    }
});

export const { setRole } = roleSlice.actions;
export default roleSlice.reducer;