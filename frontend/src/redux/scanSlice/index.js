import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  scanResult: null,
  loading: false,
  error: null,
  scannedPatient: null,
};

export const verifyQR = createAsyncThunk(
  "/api/user/verifyQR",
  async ({ patientId }, { getState }) => {
    const { token } = getState().auth;
    const response = await axios.put(
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

const scanSlice = createSlice({
  name: "scan",
  initialState,
  reducers: {
    setScanResult: (state, action) => {
      state.scanResult = action.payload;
    },
    resetScanResult: (state) => {
      state.scanResult = null;
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
      });
  },
});

export const { setScanResult, resetScanResult } = scanSlice.actions;
export default scanSlice.reducer;
