import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  items: Array<any>;
}

const initialState = {
  items: [],
} as CartState;

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{}>) => {
      state.items = [...state.items, action.payload];
    },
    removeFromCart: (state, action: PayloadAction<any>) => {
      const index = state.items.findIndex((cartItem) => {
        return cartItem.id === action.payload;
      });
      console.log(index);
      let newCart = [...state.items];
      if (index >= 0) {
        newCart.splice(index, 1);
      } else {
        console.warn(
          `Cant remove product (id: ${action.payload}) as it is not in the basket`
        );
      }
      state.items = newCart;
    },
    setCart: (state, action: PayloadAction<any>) => {
      let payloadAlias: any[] = [];
      action.payload.forEach((element: any) => {
        for (let i = 0; i < element.count; i++) {
          payloadAlias = [...payloadAlias, { ...element, count: 1 }];
        }
      });
      state.items = [...payloadAlias];
    },
  },
});

export const { addToCart, removeFromCart, setCart } = cartSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state: RootState) => state.cart.items;
export const selectTotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.price, 0);
export default cartSlice.reducer;
