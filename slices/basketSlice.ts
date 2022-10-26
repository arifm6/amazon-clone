import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { PayloadAction } from "@reduxjs/toolkit";
export interface BasketState {
  items: [];
}

const initialState: BasketState = {
  items: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, action: PayloadAction) => {},
    removeFromBasket: (state, action: PayloadAction) => {},
  },
});

export const { addToBasket, removeFromBasket } = basketSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state: RootState) => state.basket.items;

export default basketSlice.reducer;
