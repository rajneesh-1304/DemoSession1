import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addAddress, getAddress, getAllAddress } from "./addressService";

interface AddressState {
  address:any[];
  currentAddress: any ;
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  address:[],
  currentAddress: null,
  loading: false,
  error: null,
};

export const addAddressThunk = createAsyncThunk(
  "address/add",
  async (userData: any, { rejectWithValue }) => {
    try {
      return await addAddress(userData);
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getAddressThunk = createAsyncThunk(
  "address",
  async (userData: any , { rejectWithValue }) => {
    try {
      return await getAddress(userData);
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const getAllAddressThunk = createAsyncThunk(
  "address/all",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllAddress();
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentAddress = null;
      state.loading = false;
      state.error = null;
    },

    clearUsers: (state) => {
      state.currentAddress = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAddressThunk.fulfilled, (state, action) => {
        // state.currentAddress = action.payload;
        state.loading = false;
      })
      .addCase(addAddressThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddressThunk.rejected, (state, action) => {
        state.error = action.error.message || "Add Address failed";
      })
      .addCase(getAddressThunk.fulfilled, (state, action) => {
        state.currentAddress = action.payload;
        state.loading = false;
      })
      .addCase(getAddressThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddressThunk.rejected, (state, action) => {
        state.error = action.error.message || "Add Address failed";
      })
      .addCase(getAllAddressThunk.fulfilled, (state, action) => {
        state.address = action.payload;
        state.loading = false;
      })
      .addCase(getAllAddressThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAddressThunk.rejected, (state, action) => {
        state.error = action.error.message || "Add Address failed";
      })
  },
});

export const { logout, clearUsers } = addressSlice.actions;
export default addressSlice.reducer;
