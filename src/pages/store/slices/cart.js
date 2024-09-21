import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id && item.size === newItem.size);
            if (!existingItem) {
                state.items.push({
                    ...newItem,
                    quantity: 1,
                });
                state.totalQuantity++;
                state.totalAmount += newItem.offerPrice;
            } else {
                existingItem.quantity++;
                state.totalAmount += existingItem.offerPrice;
            }
        },
        removeItemFromCart(state, action) {
            const { id, size } = action.payload;
            const existingItem = state.items.find(item => item.id === id && item.size === size);
            if (existingItem) {
                state.totalAmount -= existingItem.offerPrice;
                state.totalQuantity--;
                if (existingItem.quantity === 1) {
                    state.items = state.items.filter(item => !(item.id === id && item.size === size));
                } else {
                    existingItem.quantity--;
                }
            }
        },
        increaseItemQuantity: (state, action) => {
            const { id, size } = action.payload;
            const existingItem = state.items.find(
                (item) => item.id === id && item.size === size
            );
            if (existingItem) {
                existingItem.quantity += 1;
                state.totalQuantity += 1;
                state.totalAmount += existingItem.offerPrice;
            }
        },
        decreaseItemQuantity: (state, action) => {
            const { id, size } = action.payload;
            const existingItem = state.items.find(
                (item) => item.id === id && item.size === size
            );
            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity -= 1;
                state.totalQuantity -= 1;
                state.totalAmount -= existingItem.offerPrice;
            }
        },
    },
});

export const { addItemToCart, removeItemFromCart, increaseItemQuantity, decreaseItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;
