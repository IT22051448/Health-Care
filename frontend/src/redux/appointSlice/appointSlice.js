import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  appointments: [],
  hospitals: [],
  servicesData: [],
  availableDates: [],
  cancelledAppointments: [],
  service: null,
  loading: false,
  error: null,
  appointmentsByMonth: [], // New state for storing appointments by month
  appointmentsByYear: [], // New state for storing appointments by year
  showPopup: false,
  previousAppointmentsByMonth: [],
  doctors: [],
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

// This code is used to fetch all appointments
export const fetchAllAppointments = createAsyncThunk(
  "appointments/fetchAllAppointments",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}appoint/all-appointments`
    );
    return response.data;
  }
);

// This code is used to create a service
export const createService = createAsyncThunk(
  "appointments/createService",
  async (serviceData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}doctorService/create-service`,
      serviceData
    );
    return response.data;
  }
);

// This code is used to Fetch an appointment by ID
export const fetchAppointmentByID = createAsyncThunk(
  "appointments/fetchAppointmentByID",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}appoint/appointment/${id}`
    );
    return response.data;
  }
);

// This code is used to Update an appointment
export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async ({ id, appointmentData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}appoint/update-appointment/${id}`,
      appointmentData
    );
    return response.data;
  }
);

// This code is used to Delete an appointment
export const deleteAppointment = createAsyncThunk(
  "appointments/deleteAppointment",
  async (id) => {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}appoint/delete-appointment/${id}`
    );
    return id; // Return the id to use in the reducer
  }
);

// This code is used to fetch cancelled appointments
export const fetchCancelledAppointments = createAsyncThunk(
  "appointments/fetchCancelledAppointments",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}appoint/cancelled-appointments`
    );
    return response.data;
  }
);

// This code is used to delete a service
export const deleteService = createAsyncThunk(
  "appointments/deleteService",
  async (id) => {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}doctorService/delete-service/${id}`
    );
    return id;
  }
);

// This is used to fetch services in ViewServices page
export const fetchServices = createAsyncThunk(
  "appointments/fetchServices",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}doctorService/get-services`
    );
    return response.data;
  }
);

export const getAllAppointmentsByMonth = createAsyncThunk(
  "appointments/getAllAppointmentsByMonth",
  async ({ month, year }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}appoint/appointments-by-month?month=${month}&year=${year}`
    );
    return response.data;
  }
);

export const getPreviousAppointmentsByMonth = createAsyncThunk(
  "appointments/getPreviousAppointmentsByMonth",
  async ({ month, year }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}appoint/previous-appointments-by-month?month=${month}&year=${year}`
    );
    return response.data;
  }
);

// This code is used to fetch all appointments by year
export const getAllAppointmentsByYear = createAsyncThunk(
  "appointments/getAllAppointmentsByYear",
  async (year) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}appoint/appointments-by-year?year=${year}`
    );
    return response.data;
  }
);

// This code is used to delete a specific cancelled appointment
export const deleteCancelledAppointment = createAsyncThunk(
  "appointments/deleteCancelledAppointment",
  async (id) => {
    await axios.delete(
      `${
        import.meta.env.VITE_API_URL
      }appoint/delete-cancelled-appointments/${id}`
    );
    return id;
  }
);

// This code is used to delete all cancelled appointments
export const deleteAllCancelledAppointments = createAsyncThunk(
  "appointments/deleteAllCancelledAppointments",
  async () => {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}appoint/delete-cancelled-appointments`
    );
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
      })
      .addCase(fetchAllAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createService.pending, (state) => {
        state.loading = true;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAppointmentByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointmentByID.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.appointments.findIndex(
          (appt) => appt._id === action.payload._id
        );
        if (existingIndex !== -1) {
          state.appointments[existingIndex] = action.payload;
        } else {
          state.appointments.push(action.payload);
        }
      })
      .addCase(fetchAppointmentByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAppointment = action.payload;
        const index = state.appointments.findIndex(
          (appt) => appt._id === updatedAppointment._id
        );
        if (index !== -1) {
          state.appointments[index] = updatedAppointment;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(
          (appt) => appt._id !== action.payload
        );
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCancelledAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCancelledAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.cancelledAppointments = action.payload;
      })
      .addCase(fetchCancelledAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.servicesData = state.servicesData.filter(
          (service) => service._id !== action.payload
        );
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.servicesData = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  
      .addCase(deleteCancelledAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCancelledAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.cancelledAppointments = state.cancelledAppointments.filter(
          (appt) => appt._id !== action.payload
        );
      })
      .addCase(deleteCancelledAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteAllCancelledAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllCancelledAppointments.fulfilled, (state) => {
        state.loading = false;
        state.cancelledAppointments = [];
      })
      .addCase(deleteAllCancelledAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllAppointmentsByMonth.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAppointmentsByMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentsByMonth = action.payload; // Store the fetched appointments by month
      })
      .addCase(getAllAppointmentsByMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.appointmentsByMonth=[];
        state.showPopup = true;
      })
      .addCase(getAllAppointmentsByYear.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAppointmentsByYear.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentsByYear = action.payload; // Store the fetched appointments by year
      })
      .addCase(getAllAppointmentsByYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase('RESET_POPUP', (state) => {
        state.showPopup = false;
      })
      .addCase(getPreviousAppointmentsByMonth.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPreviousAppointmentsByMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.previousAppointmentsByMonth = action.payload; // Store the fetched appointments by month
      })
      .addCase(getPreviousAppointmentsByMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.previousAppointmentsByMonth=[];
        state.showPopup = false;
      })
      
      
  },
});

export const { clearAppointments } = appointSlice.actions;
export default appointSlice.reducer;
