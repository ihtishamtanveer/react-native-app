import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from "../actions/loadingActions";
import { AppDispatch, RootState } from "../store";

export interface Item {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface ItemsState {
  items: Item[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchItems = createAsyncThunk<
  Item[],
  void,
  { dispatch: AppDispatch }
>("items/fetchItems", async (_, { dispatch }) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get<Item[]>(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return response.data;
  } finally {
    dispatch(setLoading(false));
  }
});

export const addItem = createAsyncThunk<
  Item,
  Omit<Item, "id">,
  { dispatch: AppDispatch; state: { items: ItemsState } }
>("items/addItem", async (newItem, { getState, dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));
    const state = getState();
    const existingItem = state.items.items.find(
      (item) => item.title === newItem.title
    );

    if (existingItem) {
      return rejectWithValue("An item with this title already exists.");
    }

    const response = await axios.post<Item>(
      "https://jsonplaceholder.typicode.com/posts",
      newItem
    );
    return response.data;
  } finally {
    dispatch(setLoading(false));
  }
});

export const updateItem = createAsyncThunk<
  Item,
  Item,
  { dispatch: AppDispatch; state: RootState }
>(
  "items/updateItem",
  async (updatedItem, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const state = getState();
      const existingItem = state.items.items.find(
        (item: { title: string; id: number }) =>
          item.title === updatedItem.title && item.id !== updatedItem.id
      );

      if (existingItem) {
        return rejectWithValue("An item with this title already exists.");
      }

      const response = await axios.put<Item>(
        `https://jsonplaceholder.typicode.com/posts/${updatedItem.id}`,
        updatedItem
      );
      return response.data;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const deleteItem = createAsyncThunk<
  number,
  number,
  { dispatch: AppDispatch }
>("items/deleteItem", async (id, { dispatch }) => {
  try {
    dispatch(setLoading(true));
    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
    return id;
  } finally {
    dispatch(setLoading(false));
  }
});
const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addItem.fulfilled, (state, action: PayloadAction<Item>) => {
        state.items.push(action.payload);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to add item";
      })
      .addCase(updateItem.fulfilled, (state, action: PayloadAction<Item>) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update item";
      })
      .addCase(deleteItem.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default itemsSlice.reducer;
