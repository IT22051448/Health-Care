import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  appointments: [],
  hospitals: [],
  servicesData: [],
  availableDates: [],
  service: null,
  loading: false,
  error: null,
};

// This code is used to fetch hospitals
export const fetchHospitals = createAsyncThunk(
  "appointments/fetchHospitals",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}hospital/get-hospitals`
    );
    return response.data;
  }
);

// This code is used to fetch doctors
export const fetchDoctors = createAsyncThunk(
  "appointments/fetchDoctors",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}doctor/get-doctors`
    );
    return response.data;
  }
);

// This code is used to fetch services data
export const fetchServicesData = createAsyncThunk(
  "appointments/fetchServicesData",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}doctorService/get-services`
    );
    return response.data;
  }
);

// This code is used to fetch service details by ID
export const fetchServiceById = createAsyncThunk(
  "appointments/fetchServiceById",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}doctorService/get-service/${id}`
    );
    return response.data;
  }
);

// This code is used to update service details
export const updateServiceDetails = createAsyncThunk(
  "appointments/updateServiceDetails",
  async ({ id, updatedService }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}doctorService/update-service/${id}`,
      updatedService
    );
    return response.data;
  }
);

// This code is used to fetch service details by name
export const fetchServiceByName = createAsyncThunk(
  "appointments/fetchServiceByName",
  async (serviceName) => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }service/get-service-by-name/${serviceName}`
    );
    return response.data;
  }
);

// This code is used to fetch scheduled appointments
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

// This code is used to create appointments
export const createAppointment = createAsyncThunk(
  "appointments/createAppointment",
  async (appointmentData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}appoint/create-appointment`,
      appointmentData,
      { withCredentials: true }
    );
    return response.data;
  }
);

// This code is used to reschedule an appointment
export const rescheduleAppointment = createAsyncThunk(
  "appointments/rescheduleAppointment",
  async ({ appointmentId, subAppointmentId, newDate, newTimes }) => {
    const response = await axios.put(
      `${
        import.meta.env.VITE_API_URL
      }appoint/reschedule-appointment/${appointmentId}/${subAppointmentId}`,
      {
        newDate,
        newTimes,
      }
    );
    return response.data;
  }
);

// This code is used to cancel an appointment
export const cancelAppointment = createAsyncThunk(
  "appointments/cancelAppointment",
  async ({ appointmentId, subAppointmentId, reason, description }) => {
    const response = await axios.delete(
      `${
        import.meta.env.VITE_API_URL
      }appoint/cancel-appointment/${appointmentId}/${subAppointmentId}`,
      {
        data: { reason, description },
      }
    );
    return response.data;
  }
);

// This code is used to fetch available dates for rescheduling
export const fetchAvailableDates = createAsyncThunk(
  "appointments/fetchAvailableDates",
  async ({ hospitalName, serviceType, doctorName }) => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }doctorService/get-available-dates?hospitalName=${hospitalName}&serviceType=${serviceType}&doctorName=${doctorName}`
    );
    return response.data;
  }
);

// This code is used to fetch all services
export const fetchAllServices = createAsyncThunk(
  "appointments/fetchAllServices",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}service/get-services`
    );
    return response.data;
  }
);

const appointSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    clearAppointments: (state) => {
      state.appointments = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        const updatedAppointment = action.payload;
        const index = state.appointments.findIndex(
          (appt) => appt._id === updatedAppointment._id
        );
        if (index !== -1) {
          state.appointments[index] = updatedAppointment;
        }
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const { appointmentId, subAppointmentId } = action.meta.arg;
        const updatedAppointments = state.appointments
          .map((appt) => ({
            ...appt,
            appointments: appt.appointments.filter(
              (subAppt) => subAppt._id !== subAppointmentId
            ),
          }))
          .filter((appt) => appt.appointments.length > 0);
        state.appointments = updatedAppointments;
      })

      .addCase(fetchServicesData.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchServicesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchServiceByName.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServiceByName.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchServiceByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAvailableDates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAvailableDates.fulfilled, (state, action) => {
        state.loading = false;
        state.availableDates = action.payload;
      })
      .addCase(fetchAvailableDates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.service = action.payload;
      })
      .addCase(updateServiceDetails.fulfilled, (state, action) => {})
      .addCase(fetchServicesData.fulfilled, (state, action) => {
        state.servicesData = action.payload;
      })
      .addCase(fetchHospitals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitals = action.payload;
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.loading = false;
        state.servicesData = action.payload;
      })
      .addCase(fetchAllServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAppointments } = appointSlice.actions;
export default appointSlice.reducer;
