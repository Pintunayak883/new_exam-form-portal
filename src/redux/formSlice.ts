import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Form {
  id: string;
  examName: string;
  heldDate: string; // Month YYYY (e.g., April 2025)
  startDate: string; // dd MMMM yyyy
  endDate: string; // dd MMMM yyyy
  examCount: number; // New field for number of exams
  createdAt: string;
}

interface FormState {
  forms: Form[];
  loading: boolean;
  error: string | null;
}

const initialState: FormState = {
  forms: [],
  loading: false,
  error: null,
};

export const createForm = createAsyncThunk(
  "forms/createForm",
  async (
    formData: {
      examName: string;
      heldDate: string;
      startDate: string;
      endDate: string;
      examCount: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/api/admin/form", formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create form"
      );
    }
  }
);

const formSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms.push(action.payload);
      })
      .addCase(createForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default formSlice.reducer;
