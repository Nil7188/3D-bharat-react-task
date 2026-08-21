import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { getInvestors } from "../services/investorService";

export const fetchInvestors = createAsyncThunk(
  "investors/fetchInvestors",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getInvestors();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch investors"
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState();

      const investorsState = state.investors;

      if (
        investorsState.data.length > 0 &&
        investorsState.loading === false
      ) {
        return false;
      }
    },
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const investorSlice = createSlice({
  name: "investors",

  initialState,

  reducers: {
    clearInvestors: (state) => {
      state.data = [];
      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchInvestors.fulfilled,
        (state, action) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )

      .addCase(
        fetchInvestors.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            action.error.message ||
            "Something went wrong";
        }
      );
  },
});

export const { clearInvestors } =
  investorSlice.actions;

export default investorSlice.reducer;