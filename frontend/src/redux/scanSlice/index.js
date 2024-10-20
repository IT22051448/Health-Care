import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  scanResult: null,
  loading: false,
  error: null,
  scannedPatient: null,
  userAppointments: [],
};

export const verifyQR = createAsyncThunk(
  "/api/user/verifyQR",
  async ({ patientId }, { getState }) => {
    console.log("Scan Slide: ", patientId);
    const { token } = getState().auth;
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}users/scanQR`,
      {
        AID: patientId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (userEmail) => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }appoint/scheduled-appointments?userEmail=${userEmail}`,
      { withCredentials: true }
    );
    return response.data;
  }
);

const scanSlice = createSlice({
  name: "scan",
  initialState,
  reducers: {
    setScanResult: (state, action) => {
      state.scanResult = action.payload;
    },
    resetScanResult: (state) => {
      state.scanResult = null;
      state.scannedPatient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyQR.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyQR.fulfilled, (state, action) => {
        state.loading = false;
        state.scannedPatient = action.payload.user;
      })
      .addCase(verifyQR.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.userAppointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setScanResult, resetScanResult } = scanSlice.actions;
export default scanSlice.reducer;
