import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    status: 'idle',
    error: null,
};

const base_url = process.env.NEXT_PUBLIC_BASE_URL;
const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

let sessionId;
if (typeof window !== 'undefined') {
    sessionId = localStorage.getItem('sessionId');
}

// Async thunk for fetching cart items
export const fetchCartItemsAsync = createAsyncThunk(
    'cart/fetchCartItems',
    async () => {
        const response = await fetch(`${base_url}/store/${brand_id}/cart`, {
            headers: {
                'session': sessionId,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch cart items');
        const data = await response.json();
        const cartItemsWithImages = data.items.map(item => {
            const storedImage = localStorage.getItem(`image_${item.variantId}`);

            return {
                ...item,
                image: storedImage,
            };
        });
        console.log(data);
        return cartItemsWithImages || [];
    }
);

// Async thunk for adding an item to the cart or increasing its quantity
export const addItemToCartAsync = createAsyncThunk(
    'cart/addItemToCart',
    async (item) => {
        const response = await fetch(`${base_url}/store/${brand_id}/cart?id=${item.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'session': sessionId,
            },
            body: JSON.stringify(item),
        });

        if (!response.ok) throw new Error('Failed to add item to cart');
        const data = await response.json();
        return {
            ...data,
            variantImage: item.image,
        };
    }
);

// Async thunk for removing an item from the cart
export const removeItemFromCartAsync = createAsyncThunk(
    'cart/removeItemFromCart',
    async (item) => {
        const response = await fetch(`${base_url}/store/${brand_id}/cart?id=${item.variantId}`, {
            method: 'DELETE',
            headers: {
                'session': sessionId,
            },
        });

        if (!response.ok) throw new Error('Failed to remove item from cart');
        const data = await response.json();
        return data;
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart items
            .addCase(fetchCartItemsAsync.fulfilled, (state, action) => {
                if (!Array.isArray(action.payload)) {
                    console.error("Expected payload to be an array, but got:", action.payload);
                    return;
                }
                state.items = action.payload;
                state.totalQuantity = action.payload.reduce((sum, item) => sum + item.qty, 0);
                state.totalAmount = action.payload.reduce((sum, item) => sum + item.price * item.qty, 0);
            })

            // Add Item to Cart or Increase Quantity Reducer
            .addCase(addItemToCartAsync.fulfilled, (state, action) => {
                const newItem = action.payload;
                const existingItem = state.items.find(item => item.id === newItem.id && item.size === newItem.size);
                console.log(existingItem)

                if (!existingItem) {
                    state.items.push({ ...newItem, qty: 1 });
                    state.totalQuantity++;
                    state.totalAmount += newItem.price;
                } else {
                    existingItem.qty++;
                    state.totalAmount += existingItem.price;
                }
            })

            // Remove Item from Cart or Decrease Quantity Reducer
            .addCase(removeItemFromCartAsync.fulfilled, (state, action) => {
                const items = action.payload.items;

                if (!items || items.length === 0) {
                    console.log("All items removed from the cart.");
                    state.items = [];
                    state.totalQuantity = 0;
                    state.totalAmount = 0;
                    return;
                }

                const itemDelete = items[0];
                const existingItem = state.items.find(item => item.id === itemDelete.id);

                if (existingItem) {
                    state.totalQuantity--;
                    if (existingItem.qty === 1) {
                        state.items = state.items.filter(item => item.id !== itemDelete.id);
                    } else {
                        existingItem.qty--;
                    }
                    state.totalAmount = state.items.reduce((acc, item) => acc + item.price * item.qty, 0);
                } else {
                    console.error("Item not found in the cart.");
                }
            })

            // Handle errors
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.error = action.error.message;
                }
            );
    },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;