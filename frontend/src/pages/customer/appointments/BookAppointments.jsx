import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHospitals,
  fetchServicesData,
  fetchServiceByName,
} from "@/redux/appointSlice/appointSlice";
import { useNavigate } from "react-router-dom";
import AppointmentModal from "@/components/appointComponents/AppointmentModal";
import { useToast } from "@/hooks/use-toast";

const BookAppointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Selectors to get hospitals, services,
  const { hospitals, servicesData } = useSelector(
    (state) => state.appointments
  );

  // State variables for managing selected hospital, service, doctor, etc.
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

  // Get user information from the Redux state
  const userEmail = useSelector((state) => state.auth.user?.email);
  const AID = useSelector((state) => state.auth.user?.AID);
  const firstName = useSelector((state) => state.auth.user?.firstname);
  const lastName = useSelector((state) => state.auth.user?.lastname);
  const dob = useSelector((state) => state.auth.user?.DOB);
  const userGender = useSelector((state) => state.auth.user?.gender);

  // Effect to initialize patient details and fetch hospitals/services
  useEffect(() => {
    if (firstName && lastName) {
      setPatientDetails((prev) => ({
        ...prev,
        fullName: `${firstName} ${lastName}`,
      }));
    }

    if (dob) {
      const age = new Date().getFullYear() - new Date(dob).getFullYear();
      setPatientDetails((prev) => ({
        ...prev,
        age,
      }));
    }

    if (userGender) {
      setPatientDetails((prev) => ({
        ...prev,
        gender: userGender,
      }));
    }

    // Fetch hospitals and services when the component mounts
    try {
      dispatch(fetchHospitals());
      dispatch(fetchServicesData());
    } catch (error) {
      console.error("Error fetching hospitals or services:", error);
      toast({
        title: "Error",
        description: "Could not load hospitals or services.",
        variant: "destructive",
      });
    }
  }, [dispatch, firstName, lastName, dob, userGender]);

  // Event handlers for selecting hospital, service, and doctor
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

  // Fetch available dates for the selected hospital, service, and doctor
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

  // Handle form submission for booking an appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if all required fields are filled
    if (!selectedHospital) {
      toast({
        title: "Error",
        description: "Please select a hospital.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedService) {
      toast({
        title: "Error",
        description: "Please select a service.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDoctor) {
      toast({
        title: "Error",
        description: "Please select a doctor.",
        variant: "destructive",
      });
      return;
    }

    if (
      !patientDetails.fullName ||
      !patientDetails.age ||
      !patientDetails.gender
    ) {
      toast({
        title: "Error",
        description: "Please complete the patient details.",
        variant: "destructive",
      });
      return;
    }

    // Validation: Ensure at least one date and time is selected
    if (selectedAppointments.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one appointment date and time.",
        variant: "destructive",
      });
      return;
    }

    let serviceAmount = 0;
    const isGovernment =
      hospitals.find((h) => h.hospitalName === selectedHospital)
        ?.hospitalType === "Government";

    if (!isGovernment && selectedService) {
      try {
        const serviceDetails = await dispatch(
          fetchServiceByName(selectedService)
        ).unwrap();
        serviceAmount = serviceDetails.amount * selectedAppointments.length;
      } catch (error) {
        console.error("Error fetching service amount:", error);
        toast({
          title: "Error",
          description: "Could not fetch service details.",
          variant: "destructive",
        });
        return;
      }
    }

    // Prepare appointment data for submission
    const appointmentData = {
      hospital: selectedHospital,
      service: selectedService,
      doctor: selectedDoctor,
      patientDetails,
      appointments: selectedAppointments,
      isGovernment,
      serviceAmount,
      userEmail: userEmail || "",
      AID: AID || "",
    };

    // If validation passes, proceed with form submission
    console.log("Appointment Data:", appointmentData);
    toast({
      title: "Success",
      description: "Please refer to the Appointment Summary!",
      style: { background: "green", color: "white" },
    });
    navigate("/patient/appointment-summary", { state: appointmentData });
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime())
      ? date.toLocaleDateString("en-GB")
      : "Invalid Date";
  };

  // Filtering services and doctors based on selected hospital and service
  const filteredServices = servicesData
    .filter((service) => service.hospitalName === selectedHospital)
    .flatMap((service) => service.services.map((serv) => serv.serviceType));

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
              readOnly
              onClick={() => {
                toast({
                  title: "Info",
                  description:
                    "Full Name cannot be changed, please edit profile if any changes",
                  style: { background: "white", color: "black" },
                });
              }}
              className="block w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <label className="block mb-1 font-medium text-gray-700 mt-2">
              Age
            </label>
            <input
              type="number"
              value={patientDetails.age}
              readOnly
              onClick={() => {
                toast({
                  title: "Info",
                  description:
                    "Age cannot be changed, please edit profile if any changes",
                  style: { background: "white", color: "black" },
                });
              }}
              className="block w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <label className="block mb-1 font-medium text-gray-700 mt-2">
              Gender
            </label>
            <div className="flex space-x-3">
              {["Male", "Female", "Other"].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => {
                    setPatientDetails({ ...patientDetails, gender });
                  }}
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
