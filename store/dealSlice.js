import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { getDeals } from "../services/dealService";

export const fetchDeals = createAsyncThunk(
  "deals/fetchDeals",
  async () => {
    const data = await getDeals();
    return data;
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const dealSlice = createSlice({
  name: "deals",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchDeals.fulfilled,
        (state, action) => {
          state.loading = false;
          state.data = action.payload;
        }
      )

      .addCase(
        fetchDeals.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error.message ||
            "Something went wrong";
        }
      );
  },
});

export default dealSlice.reducer;