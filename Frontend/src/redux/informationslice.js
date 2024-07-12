import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isDarkMode: true,
    isAuth: false,
    user: null,
    chat: {},
    rerender: false
}


const Informationslice = createSlice({
    name: 'information',
    initialState,
    reducers: {
        modechange: (state, action) => {
            state.isDarkMode = action.payload;
        },

        authchange: (state, action) => {
            state.isAuth = action.payload;
        },

        userchange: (state, action) => {
            state.user = action.payload;
        },

        chatchange: (state, action) => {
            state.chat = action.payload;
        },

        rerenderchange: (state, action) => {
            state.rerender = action.payload;
        }


    }
})

export const { modechange, authchange, userchange, chatchange,rerenderchange } = Informationslice.actions;
export default Informationslice.reducer;