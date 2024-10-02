import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateOngoingAppointments = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/appoint/appointment/${id}`
        );
        setAppointment(response.data);
        setSelectedHospital(response.data.hospital);
        setSelectedService(response.data.service);
      } catch (error) {
        console.error("Error fetching appointment:", error);
      }
    };

    const fetchHospitals = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/hospital/get-hospitals"
      );
      setHospitals(response.data);
    };

    const fetchServicesData = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/service/get-services"
      );
      setServicesData(response.data);
    };

    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/doctor/get-doctors"
        );
        console.log("Doctors fetched:", response.data); // Log the fetched data
        setDoctors(response.data); // Set all doctors
        console.log("Doctors after setting state:", response.data); // Log right after setting state
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchAppointment();
    fetchHospitals();
    fetchServicesData();
    fetchDoctors();
  }, [id]);

  useEffect(() => {
    // Update selected service details when a service is selected
    const serviceDetails = servicesData.find(
      (service) => service.name === selectedService
    );
    setSelectedServiceDetails(serviceDetails);
  }, [selectedService, servicesData]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/appoint/update-appointment/${id}`,
        appointment
      );
      alert("Appointment updated successfully!");
      navigate("/admin/ongoing-appointments");
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/appoint/delete-appointment/${appointmentId}`
      );
      alert("Appointment deleted successfully!");
      navigate("/admin/ongoing-appointments");
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleAppointmentChange = (index, field, value) => {
    const updatedAppointments = [...appointment.appointments];
    updatedAppointments[index] = {
      ...updatedAppointments[index],
      [field]: value,
    };
    setAppointment({ ...appointment, appointments: updatedAppointments });
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
                value={appointment.patientDetails.fullName}
                onChange={(e) =>
                  setAppointment({
                    ...appointment,
                    patientDetails: {
                      ...appointment.patientDetails,
                      fullName: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Age
              </label>
              <input
                type="number"
                value={
                  appointment.patientDetails.age === 0
                    ? ""
                    : appointment.patientDetails.age
                }
                onChange={(e) => {
                  const value =
                    e.target.value === ""
                      ? ""
                      : Math.max(0, Number(e.target.value));
                  setAppointment({
                    ...appointment,
                    patientDetails: {
                      ...appointment.patientDetails,
                      age: value,
                    },
                  });
                }}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-semibold mb-2 text-gray-700">
                Patient ID
              </label>
              <input
                type="text"
                value={appointment.AID} // Assuming AID is in the appointment object
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
                      setAppointment({
                        ...appointment,
                        patientDetails: {
                          ...appointment.patientDetails,
                          gender,
                        },
                      })
                    }
                    className={`flex-1 py-2 border rounded-md text-sm ${
                      appointment.patientDetails.gender === gender
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
                  setAppointment({ ...appointment, hospital: hospitalName });
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
                  setAppointment({ ...appointment, service: serviceName });
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
                value={appointment.doctor}
                onChange={(e) =>
                  setAppointment({ ...appointment, doctor: e.target.value })
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
          {appointment.appointments.map((apt, index) => (
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
                  value={apt.date.split("T")[0]} // Format date for input
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
                  value={apt.time[0]} // Assuming time is an array
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
                  appointment.isGovernment
                    ? "Government Hospital"
                    : appointment.payment.method
                }
                onChange={(e) =>
                  setAppointment({
                    ...appointment,
                    payment: { ...appointment.payment, method: e.target.value },
                  })
                }
                disabled={appointment.isGovernment}
                className="w-full p-2 border rounded"
              >
                <option value="Card Payment">Card Payment</option>
                <option value="Cash">Cash</option>
                <option value="Insurance">Insurance</option>
              </select>
              {appointment.isGovernment && (
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
                value={
                  appointment.isGovernment ? "" : appointment.payment.amount
                }
                onChange={(e) =>
                  setAppointment({
                    ...appointment,
                    payment: { ...appointment.payment, amount: e.target.value },
                  })
                }
                disabled={appointment.isGovernment}
                className="w-full p-2 border rounded"
              />
              {appointment.isGovernment && (
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
                value={appointment.payment.status}
                onChange={(e) =>
                  setAppointment({
                    ...appointment,
                    payment: { ...appointment.payment, status: e.target.value },
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
            onClick={() => handleDelete(id)}
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
