import {createSlice} from "@reduxjs/toolkit";

export const emptyInitialStateForArticlesSlice = {
    allNotes: null,
}

const initialState = emptyInitialStateForArticlesSlice

export const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        setAllNotes (state, action) {
            state.allNotes = action.payload
        },
    },
})

export const {
    setAllNotes
} = notesSlice.actions

export default notesSlice.reducer
