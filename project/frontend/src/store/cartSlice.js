import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // [{ id, title, price, thumbnail, quantity }]
  },
  reducers: {
    // Add product to cart (qty = 1). If already exists, just increment.
    addToCart: (state, action) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    // Increase quantity of a product by 1
    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) item.quantity += 1;
    },

    // Decrease quantity by 1 — remove item if quantity reaches 0
    decreaseQuantity: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        if (state.items[index].quantity <= 1) {
          state.items.splice(index, 1);
        } else {
          state.items[index].quantity -= 1;
        }
      }
    },

    // Remove all items from cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
