import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Form interface
export interface Form {
  id: string;
  examName: string;
  heldDate: string; // Month YYYY (e.g., April 2025)
  startDate: string; // dd MMMM yyyy
  endDate: string; // dd MMMM yyyy
  examCount: number; // Number of exams
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

// Fetch initial form data (GET Request)
export const fetchFormData = createAsyncThunk(
  "forms/fetchFormData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/admin/form");
      console.log("from redux", response.data.data);
      return response.data.data; // Assuming data is in response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch form data"
      );
    }
  }
);

// Create new form (POST Request)
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
      // Fetch form data
      .addCase(fetchFormData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormData.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure that state.forms is always an array
        if (Array.isArray(action.payload)) {
          state.forms = action.payload;
        } else if (action.payload) {
          // If payload is a single object, wrap it in an array
          state.forms = [action.payload];
        } else {
          state.forms = [];
        }
      })
      .addCase(fetchFormData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create new form
      .addCase(createForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure state.forms is an array and payload is a valid Form object
        if (action.payload && typeof action.payload === "object") {
          state.forms = [...state.forms, action.payload as Form];
        }
      })
      .addCase(createForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default formSlice.reducer;
