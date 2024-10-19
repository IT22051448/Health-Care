import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to create a new hospital
export const createHospital = createAsyncThunk(
  "hospitals/createHospital",
  async (hospitalData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/hospital/create-hospital",
        hospitalData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data; // Ensure this matches the actual response structure
    } catch (error) {
      console.error("Error creating hospital:", error); // Log error for debugging
      return rejectWithValue(error.response?.data || "Something went wrong"); // Provide fallback message
    }
  }
);

// Thunk to delete a hospital
export const deleteHospital = createAsyncThunk(
  "hospitals/deleteHospital",
  async (hospitalId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/hospital/delete-hospital/${hospitalId}`
      );
      return response.data; // Ensure this matches the actual response structure
    } catch (error) {
      console.error("Error deleting hospital:", error); // Log error for debugging
      return rejectWithValue(error.response?.data || "Something went wrong"); // Provide fallback message
    }
  }
);

const hospitalSlice = createSlice({
  name: "hospitals",
  initialState: {
    hospitals: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createHospital.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createHospital.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospitals.push(action.payload); // Adjust if needed based on API response
      })
      .addCase(createHospital.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteHospital.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteHospital.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted hospital from the state
        state.hospitals = state.hospitals.filter(
          (hospital) => hospital.hospitalId !== action.payload.hospitalId // Adjust based on API response
        );
      })
      .addCase(deleteHospital.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default hospitalSlice.reducer;
