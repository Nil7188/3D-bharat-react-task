import {
  configureStore,
} from "@reduxjs/toolkit";

import dealReducer from "./dealSlice";
import investorReducer from "./investorSlice";


export const store =
  configureStore({
    reducer: {
      deals: dealReducer,
      investors: investorReducer,

    },
  });