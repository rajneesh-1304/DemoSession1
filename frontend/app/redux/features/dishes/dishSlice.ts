import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { addDish, banDish, fetchDishes, fetchDishUser, unbanDish, updateDish } from "./dishService";


interface UserState {
  dishes: any[];
  currentDish: any | null;
  total:null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  dishes: [],
  currentDish: null,
  total:null,
  loading: false,
  error: null,
};

export const addDishThunk = createAsyncThunk(
  "dish/add",
  async (userData: any, { rejectWithValue }) => {
    try {
      return await addDish(userData);
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const fetchDishesThunk = createAsyncThunk(
  'dish/fetchAll',
  async (
    { page, limit, sellerId }: any,
    { rejectWithValue }
  ) => {
    try {
      return await fetchDishes({ page, limit, sellerId});
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch questions');
    }
  }
);

export const fetchDishesUserThunk = createAsyncThunk(
  'dish/fetch',
  async (
    { page, limit, sellerId, searchValue }: any,
    { rejectWithValue }
  ) => {
    try {
      return await fetchDishUser({ page, limit, sellerId, searchValue});
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch questions');
    }
  }
);

export const banDishThunk = createAsyncThunk(
  'products/banProduct',
  async (dishId: number, { rejectWithValue }) => {
    try {
      return await banDish(dishId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to ban product'
      );
    }
  }
);

export const unbanDishThunk = createAsyncThunk(
  'products/unbanProduct',
  async (dishId: number, { rejectWithValue }) => {
    try {
      return await unbanDish(dishId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to unban product'
      );
    }
  }
);

export const updateDishThunk = createAsyncThunk(
  "dish/update",
  async ({id, formDataToSend}: any, { rejectWithValue }) => {
    try {
      return await updateDish(id, formDataToSend);
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const dishSlice = createSlice({
  name: "dishes",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDishesThunk.fulfilled, (state, action) => {
        const { data, total, page } = action.payload;
        if(page == 1){
          state.dishes=data;
        }else{
          state.dishes = [...state.dishes, ...data];
        }
        state.total=total;
        state.loading = false;
      })
      .addCase(fetchDishesUserThunk.fulfilled, (state, action) => {
        const { data, total, page } = action.payload;
        if(page == 1){
          state.dishes=data;
        }else{
          state.dishes = [...state.dishes, ...data];
        }
        state.total=total;
        state.loading = false;
      })
      .addCase(addDishThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDishThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addDishThunk.rejected, (state, action) => {
        state.error = action.error.message || "Error in adding Dish";
      })

      .addCase(banDishThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(banDishThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // state.productData = state.productData.map(product =>
        //   product.id === action.payload.id
        //     ? { ...product, is_banned: !action.payload.isActive }
        //     : product
        // );
      })
      .addCase(banDishThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(unbanDishThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unbanDishThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // state.productData = state.productData.map(product =>
        //   product.id === action.payload.id
        //     ? { ...product, is_banned: !action.payload.isActive }
        //     : product
        // );
      })
      .addCase(unbanDishThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export default dishSlice.reducer;
