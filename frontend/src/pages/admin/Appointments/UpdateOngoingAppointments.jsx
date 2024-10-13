import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHospitals,
  fetchAllServices,
  fetchDoctors,
  fetchAppointmentByID,
  updateAppointment,
  deleteAppointment,
} from "@/redux/appointSlice/appointSlice";

const UpdateOngoingAppointments = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const appointment = useSelector((state) =>
    state.appointments.appointments.find((appt) => appt._id === id)
  );
  const hospitals = useSelector((state) => state.appointments.hospitals);
  const servicesData = useSelector((state) => state.appointments.servicesData);
  const doctors = useSelector((state) => state.appointments.doctors);

  const [formData, setFormData] = useState(appointment || {});
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);

  useEffect(() => {
    dispatch(fetchHospitals());
    dispatch(fetchAllServices());
    dispatch(fetchDoctors());
    dispatch(fetchAppointmentByID(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
      setSelectedHospital(appointment.hospital);
      setSelectedService(appointment.service);
    }
  }, [appointment]);

  useEffect(() => {
    const serviceDetails = servicesData.find(
      (service) => service.name === selectedService
    );
    setSelectedServiceDetails(serviceDetails);
  }, [selectedService, servicesData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update nested patientDetails for fullName and age
    if (name === "fullName" || name === "age") {
      setFormData((prev) => ({
        ...prev,
        patientDetails: {
          ...prev.patientDetails,
          [name]: value,
        },
      }));
    } else {
      // For other fields, update directly
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateAppointment({ id, appointmentData: formData })
      ).unwrap();
      alert("Appointment updated successfully!");
      navigate("/admin/ongoing-appointments");
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteAppointment(id)).unwrap();
      alert("Appointment deleted successfully!");
      navigate("/admin/ongoing-appointments");
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleAppointmentChange = (index, field, value) => {
    const updatedAppointments = [...formData.appointments];
    updatedAppointments[index] = {
      ...updatedAppointments[index],
      [field]: value,
    };
    setFormData({ ...formData, appointments: updatedAppointments });
  };

  if (!appointment) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Update Appointments</h1>
      <form onSubmit={handleEditSubmit} className="space-y-6">
        {/* Patient Details Section */}
        <div className="border p-4 rounded-md shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.patientDetails?.fullName || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.patientDetails?.age || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-semibold mb-2 text-gray-700">
                Account ID
              </label>
              <input
                type="text"
                value={formData.AID}
                readOnly
                className="w-1/2 p-2 border rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
            {/* Gender Selection */}
            <div className="col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
                Gender
              </label>
              <div className="flex space-x-3">
                {["Male", "Female", "Other"].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        patientDetails: {
                          ...formData.patientDetails,
                          gender,
                        },
                      })
                    }
                    className={`flex-1 py-2 border rounded-md text-sm ${
                      formData.patientDetails?.gender === gender
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-white text-black border-gray-300"
                    } hover:bg-blue-500 transition duration-200`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Service Details Section */}
        <div className="border p-4 rounded-md shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Service Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Hospital
              </label>
              <select
                value={selectedHospital}
                onChange={(e) => {
                  const hospitalName = e.target.value;
                  setSelectedHospital(hospitalName);
                  setFormData({ ...formData, hospital: hospitalName });
                }}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital._id} value={hospital.hospitalName}>
                    {hospital.hospitalName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => {
                  const serviceName = e.target.value;
                  setSelectedService(serviceName);
                  setFormData({ ...formData, service: serviceName });
                }}
                className="w-full p-2 border rounded"
                disabled={!selectedHospital}
              >
                <option value="">Select Service</option>
                {servicesData.map((service) => (
                  <option key={service._id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Doctor
              </label>
              <select
                value={formData.doctor}
                onChange={(e) =>
                  setFormData({ ...formData, doctor: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor.fullName}>
                    {doctor.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Service Amount
              </label>
              <input
                type="text"
                value={
                  selectedServiceDetails ? selectedServiceDetails.amount : ""
                }
                readOnly
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="border p-4 rounded-md shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Appointments</h2>
          {formData.appointments.map((apt, index) => (
            <div
              key={apt._id}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={apt.date.split("T")[0]}
                  onChange={(e) =>
                    handleAppointmentChange(index, "date", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Appointment Time
                </label>
                <input
                  type="time"
                  value={apt.time[0]}
                  onChange={(e) =>
                    handleAppointmentChange(index, "time", [e.target.value])
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Payment Details Section */}
        <div className="border p-4 rounded-md shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Payment Method
              </label>
              <select
                value={
                  formData.isGovernment
                    ? "Government Hospital"
                    : formData.payment.method
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment: { ...formData.payment, method: e.target.value },
                  })
                }
                disabled={formData.isGovernment}
                className="w-full p-2 border rounded"
              >
                <option value="Card Payment">Card Payment</option>
                <option value="Cash">Cash</option>
                <option value="Insurance">Insurance</option>
              </select>
              {formData.isGovernment && (
                <p className="text-gray-500">
                  Government Hospital - No payment method required
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Payment Amount
              </label>
              <input
                type="number"
                value={formData.isGovernment ? "" : formData.payment.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment: { ...formData.payment, amount: e.target.value },
                  })
                }
                disabled={formData.isGovernment}
                className="w-full p-2 border rounded"
              />
              {formData.isGovernment && (
                <p className="text-gray-500">
                  Government Hospital - No payment required
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Payment Status
              </label>
              <select
                value={formData.payment.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment: { ...formData.payment, status: e.target.value },
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Update Appointment
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          >
            Delete Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOngoingAppointments;
