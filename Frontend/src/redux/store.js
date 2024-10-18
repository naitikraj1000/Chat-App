import { configureStore } from '@reduxjs/toolkit';
import informationReducer from './informationslice.js';

const store = configureStore({
  reducer: {
    information: informationReducer,
  },
});

export default store;