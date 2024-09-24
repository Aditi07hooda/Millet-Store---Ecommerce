import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cart';
import React from 'react';

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;
