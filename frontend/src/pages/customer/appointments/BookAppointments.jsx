import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AppointmentModal from "../../../components/appointComponents/AppointmentModal";

const BookAppointments = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [patientDetails, setPatientDetails] = useState({
    fullName: "",
    age: "",
    gender: "",
    description: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch user email from Redux store
  const userEmail = useSelector((state) => state.auth.user?.email);

  // Fetch AID from Redux store
  const AID = useSelector((state) => state.auth.user?.AID);

  useEffect(() => {
    const fetchHospitals = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/hospital/get-hospitals"
      );
      setHospitals(response.data);
    };

    const fetchServicesData = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/doctorService/get-services"
      );
      setServicesData(response.data);
    };

    fetchHospitals();
    fetchServicesData();
  }, []);

  const handleHospitalChange = (e) => {
    const hospital = e.target.value;
    setSelectedHospital(hospital);
    setSelectedService("");
    setSelectedDoctor("");
    setAvailableDates([]);
    setSelectedAppointments([]);
  };

  const handleServiceChange = (e) => {
    const service = e.target.value;
    setSelectedService(service);
    setSelectedDoctor("");
    setAvailableDates([]);
    setSelectedAppointments([]);
  };

  const handleDoctorChange = (e) => {
    const doctorName = e.target.value;
    setSelectedDoctor(doctorName);
    fetchAvailableDates(selectedHospital, selectedService, doctorName);
  };

  const fetchAvailableDates = (hospital, service, doctorName) => {
    const doctorServices = servicesData.filter(
      (serviceData) =>
        serviceData.hospitalName === hospital &&
        serviceData.doctorName === doctorName
    );

    const allDates = doctorServices.flatMap((serviceData) =>
      serviceData.services
        .filter((serv) => serv.serviceType === service)
        .flatMap((serv) => serv.dates)
    );

    const groupedDates = allDates.reduce((acc, curr) => {
      const foundDate = acc.find((d) => d.date === curr.date);
      if (foundDate) {
        foundDate.times = [...new Set([...foundDate.times, ...curr.times])];
      } else {
        acc.push({ date: curr.date, times: curr.times });
      }
      return acc;
    }, []);

    setAvailableDates(groupedDates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let serviceAmount = 0;
    const isGovernment =
      hospitals.find((h) => h.hospitalName === selectedHospital)
        ?.hospitalType === "Government";

    if (!isGovernment && selectedService) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/service/get-service-by-name/${selectedService}`
        );
        serviceAmount = response.data.amount * selectedAppointments.length;
      } catch (error) {
        console.error("Error fetching service amount:", error);
      }
    }

    const appointmentData = {
      hospital: selectedHospital,
      service: selectedService,
      doctor: selectedDoctor,
      patientDetails,
      appointments: selectedAppointments,
      isGovernment,
      serviceAmount,
      userEmail: userEmail || "", // Default to empty string if undefined
      AID: AID || "", // Default to empty string if undefined
    };

    console.log("Appointment Data:", appointmentData);

    // Navigate to the appointment summary page and pass data
    navigate("/patient/appointment-summary", { state: appointmentData });
  };

  const resetForm = () => {
    setSelectedAppointments([]);
    setSelectedHospital("");
    setSelectedService("");
    setSelectedDoctor("");
    setAvailableDates([]);
    setPatientDetails({
      fullName: "",
      age: "",
      gender: "",
      description: "",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime())
      ? date.toLocaleDateString("en-GB")
      : "Invalid Date";
  };

  const filteredServices = servicesData
    .filter((service) => service.hospitalName === selectedHospital)
    .flatMap((service) => service.services.map((serv) => serv.serviceType));

  // Filter doctors based on selected hospital and service
  const filteredDoctors = servicesData
    .filter((service) => service.hospitalName === selectedHospital)
    .flatMap((service) =>
      service.services
        .filter((serv) => serv.serviceType === selectedService)
        .map((serv) => service.doctorName)
    );

  return (
    <div className="bg-blue-400">
      <div className="container mt-5 mb-5 mx-auto p-8 max-w-xl border border-gray-300 rounded-lg shadow-lg bg-white">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-700">
          Book Appointments
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hospital and Services Section */}
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-600">
              Hospital and Service
            </h2>
            <div className="mt-2">
              <label className="block mb-1 font-medium text-gray-700">
                Hospital
              </label>
              <select
                value={selectedHospital}
                onChange={handleHospitalChange}
                className="block w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital._id} value={hospital.hospitalName}>
                    {hospital.hospitalName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-2">
              <label className="block mb-1 font-medium text-gray-700">
                Service
              </label>
              <select
                value={selectedService}
                onChange={handleServiceChange}
                className="block w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedHospital}
              >
                <option value="">Select Service</option>
                {filteredServices.length > 0 ? (
                  [...new Set(filteredServices)].map((serviceType) => (
                    <option key={serviceType} value={serviceType}>
                      {serviceType}
                    </option>
                  ))
                ) : (
                  <option disabled>No Services Available</option>
                )}
              </select>
            </div>

            <div className="mt-2">
              <label className="block mb-1 font-medium text-gray-700">
                Doctor
              </label>
              <select
                value={selectedDoctor}
                onChange={handleDoctorChange}
                className="block w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedService}
              >
                <option value="">Select Doctor</option>
                {filteredDoctors.length > 0 ? (
                  [...new Set(filteredDoctors)].map((doctor) => (
                    <option key={doctor} value={doctor}>
                      {doctor}
                    </option>
                  ))
                ) : (
                  <option disabled>No Doctors Available</option>
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="bg-blue-500 text-white py-2 rounded-md mt-3 w-full hover:bg-blue-600 transition duration-200"
              disabled={!selectedDoctor || availableDates.length === 0}
            >
              Select Date and Time
            </button>
          </div>

          {/* Appointments Section */}
          {selectedAppointments.length > 0 && (
            <div className="mt-5">
              <h2 className="text-xl font-semibold mb-3 text-gray-600">
                Appointments
              </h2>
              <ul className="mt-3">
                {selectedAppointments.map((appointment, index) => (
                  <li key={index} className="mb-1 text-sm text-gray-600">
                    Appointment on {formatDate(appointment.date)}:{" "}
                    {appointment.time &&
                    Array.isArray(appointment.time) &&
                    appointment.time.length > 0
                      ? appointment.time.join(", ")
                      : "No time selected"}{" "}
                    with {selectedDoctor} for {selectedService} at{" "}
                    {selectedHospital}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Patient Details Form */}
          <div className="mt-5">
            <h2 className="text-xl font-semibold mb-3 text-gray-600">
              Patient Details
            </h2>
            <label className="block mb-1 font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={patientDetails.fullName}
              onChange={(e) =>
                setPatientDetails({
                  ...patientDetails,
                  fullName: e.target.value,
                })
              }
              className="block w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mt-2">
            <label className="block mb-1 font-medium text-gray-700">Age</label>
            <input
              type="number"
              value={patientDetails.age}
              onChange={(e) => {
                const value = e.target.value;
                // If the input is empty, set it to an empty string, otherwise ensure it's not below 0
                setPatientDetails({
                  ...patientDetails,
                  age: value === "" ? "" : Math.max(0, value),
                });
              }}
              className="block w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mt-2">
            <label className="block mb-1 font-medium text-gray-700">
              Gender
            </label>
            <div className="flex space-x-3">
              {["Male", "Female", "Other"].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() =>
                    setPatientDetails({ ...patientDetails, gender })
                  }
                  className={`flex-1 py-2 border rounded-md text-sm ${
                    patientDetails.gender === gender
                      ? "bg-blue-500 text-white border-blue-600"
                      : "bg-white text-black border-gray-300"
                  } hover:bg-blue-500 transition duration-200`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2">
            <label className="block mb-1 font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={patientDetails.description}
              onChange={(e) =>
                setPatientDetails({
                  ...patientDetails,
                  description: e.target.value,
                })
              }
              className="block w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white py-2 rounded-md mt-4 w-full hover:bg-green-600 transition duration-200"
          >
            Book Appointment
          </button>
        </form>

        <AppointmentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          setSelectedAppointments={setSelectedAppointments}
          availableDates={availableDates}
          selectedDoctor={selectedDoctor}
          selectedService={selectedService}
          selectedHospital={selectedHospital}
        />
      </div>
    </div>
  );
};

export default BookAppointments;
