import { configureStore, createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    data: [],
    refreshing: false,
  },
  reducers: {
    setProducts: (state, action) => {
      state.data = action.payload;
    },
    setRefreshing: (state, action) => {
      state.refreshing = action.payload;
    },
  },
});

const { setProducts, setRefreshing } = productSlice.actions;

const store = configureStore({
  reducer: {
    products: productSlice.reducer,
  },
});

export { store, setProducts, setRefreshing };
