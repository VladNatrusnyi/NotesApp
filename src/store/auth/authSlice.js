export const btn = {display: 'none'}
import {createSlice} from "@reduxjs/toolkit";


export const emptyInitialStateForAuthSlice = {
    currentUser: null,
    isLoading: false,
    isLoadingWhenCheckLoginUser: false,
    isLoadingChanges: false
}

const initialState = emptyInitialStateForAuthSlice

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCurrentUser(state, action) {
            state.currentUser = action.payload
        },
        setAuthIsLoading(state, action) {
            state.isLoading = action.payload
        },
        setIsLoadingWhenCheckLoginUser(state, action) {
            state.isLoadingWhenCheckLoginUser = action.payload
        },
        setAuthIsLoadingChanges(state, action) {
            state.isLoadingChanges = action.payload
        },
    },
})


export const {
    setCurrentUser,
    setAuthIsLoading,
    setIsLoadingWhenCheckLoginUser,
    setAuthIsLoadingChanges
} = authSlice.actions

export default authSlice.reducer
