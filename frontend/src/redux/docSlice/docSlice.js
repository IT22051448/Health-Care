import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to create a new doctor
export const addDoctor = createAsyncThunk(
  "doctor/createDoctor",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/doctor/create-doctor",
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    loading: false,
    error: null,
    addDoctorSuccess: false, // track doctor addition success
  },
  reducers: {
    resetAddDoctorState: (state) => {
      state.addDoctorSuccess = false; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDoctor.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors.push(action.payload.data); // Add new doctor to the list
        state.addDoctorSuccess = true; 
      })
      .addCase(addDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAddDoctorState } = doctorsSlice.actions;
export default doctorsSlice.reducer;
