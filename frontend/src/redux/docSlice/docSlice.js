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

// Thunk to update an existing doctor
export const updateDoctor = createAsyncThunk(
  "doctor/updateDoctor",
  async ({ doctorId, formdata }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/doctor/update-doctor/${doctorId}`,
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

// Thunk to delete a doctor
export const deleteDoctor = createAsyncThunk(
  "doctor/deleteDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/doctor/delete-doctor/${doctorId}`
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
    addDoctorSuccess: false,
    updateDoctorSuccess: false,
    deleteDoctorSuccess: false,
  },
  reducers: {
    resetAddDoctorState: (state) => {
      state.addDoctorSuccess = false;
    },
    resetUpdateDoctorState: (state) => {
      state.updateDoctorSuccess = false;
    },
    resetDeleteDoctorState: (state) => {
      state.deleteDoctorSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDoctor.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors.push(action.payload.data);
        state.addDoctorSuccess = true;
      })
      .addCase(addDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDoctor.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.map((doctor) =>
          doctor._id === action.payload.data._id ? action.payload.data : doctor
        );
        state.updateDoctorSuccess = true;
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDoctor.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.filter(
          (doctor) => doctor._id !== action.meta.arg
        );
        state.deleteDoctorSuccess = true;
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetAddDoctorState,
  resetUpdateDoctorState,
  resetDeleteDoctorState,
} = doctorsSlice.actions;
export default doctorsSlice.reducer;
