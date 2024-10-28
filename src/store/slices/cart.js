import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSessionId } from "../LocalStorage";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  status: "idle",
  error: null,
};

const base_url = process.env.NEXT_PUBLIC_BASE_URL;
const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

// Async thunk for fetching cart items
export const fetchCartItemsAsync = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    const sessionId = getSessionId();
    console.log(sessionId);
    const response = await fetch(`${base_url}/store/${brand_id}/cart/full`, {
      headers: {
        session: sessionId,
      },
    });
    console.log(sessionId);
    if (!response.ok) throw new Error("Failed to fetch cart items");
    const data = await response.json();
    const cartItemsWithImages = data.cart.items.map((item) => {
      const storedImage = localStorage.getItem(`image_${item.variantId}`);

      return {
        ...item,
        image: storedImage,
      };
    });
    console.log(data);
    console.log(cartItemsWithImages);
    return cartItemsWithImages || [];
  }
);

// adding an item to the cart or increasing its quantity
export const addItemToCartAsync = createAsyncThunk(
  "cart/addItemToCart",
  async (item) => {
    const sessionId = getSessionId();
    const response = await fetch(
      `${base_url}/store/${brand_id}/cart?id=${item.variantId}`,
      {
        method: "POST",
        headers: {
          session: sessionId,
        },
        body: JSON.stringify({
          variantName: item.size,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.error("Unauthorized. Please log in again.");
      }
      throw new Error("Failed to add item to cart");
    }
    const data = await response.json();
    console.log(data);
    return {
      ...data,
      increasedItem: item,
      variantImage: item.image,
    };
  }
);

// Async thunk for removing an item from the cart
export const removeItemFromCartAsync = createAsyncThunk(
  "cart/removeItemFromCart",
  async (item) => {
    const sessionId = getSessionId();
    const response = await fetch(
      `${base_url}/store/${brand_id}/cart?id=${item.variantId}`,
      {
        method: "DELETE",
        headers: {
          session: sessionId,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to remove item from cart");
    return await response.json();
  }
);

const getCartItemsWithImages = (items) => {
  return items.map((item) => ({
    ...item,
    image: localStorage.getItem(`image_${item.variantId}`) || item.image,
  }));
};

const cartSlice = createSlice({
  name: "cart",
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
          console.error(
            "Expected payload to be an array, but got:",
            action.payload
          );
          return;
        }
        state.items = getCartItemsWithImages(action.payload);
        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + item.qty,
          0
        );
        state.totalAmount = state.items.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        );
      })

      // Add item to cart
      .addCase(addItemToCartAsync.fulfilled, (state, action) => {
        const newItem = action.payload.increasedItem;
        const existingItem = state.items.find(
          (item) => item.variantId === newItem.variantId 
        );

        console.log("existing item add", existingItem, newItem)

        if (!existingItem) {
          state.items.push({ ...newItem, qty: 1 });
          state.totalQuantity++;
          state.totalAmount += newItem.price;
        } else {
          existingItem.qty++;
          state.totalAmount += existingItem.price;
        }
      })

      // Remove item from cart
      .addCase(removeItemFromCartAsync.fulfilled, (state, action) => {
        const items = action.payload.items;

        if (!items) {
          console.error("Unexpected payload structure:", action.payload);
          return;
        }

        state.items = items.length === 0 ? [] : getCartItemsWithImages(items);
        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + item.qty,
          0
        );
        state.totalAmount = state.items.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        );
      })

      // Handle errors
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.error.message;
        }
      );
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
// now other problem rised that is on clicking pluss(add) button to increase quantity it is increasing the expected item in backend but it is showing increase of item of 1st element in UI and after reloading it become perfect
