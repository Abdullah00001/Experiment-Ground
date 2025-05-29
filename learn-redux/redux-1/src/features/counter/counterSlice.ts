import { createSlice } from "@reduxjs/toolkit";
type CounterState = {
  value: number;
};

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "CounterSlice",
  initialState,
  reducers: {
    like: (state) => {
      state.value += 1;
    },
    disLike: (state) => {
      if (state.value >=1) state.value -= 1;
      return;
    },
  },
});

export const { like, disLike } = counterSlice.actions;
export default counterSlice.reducer;
