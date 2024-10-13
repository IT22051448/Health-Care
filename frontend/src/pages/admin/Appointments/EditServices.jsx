import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditService = () => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [servicesList, setServicesList] = useState([]); // State for all services
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [serviceDetails, setServiceDetails] = useState([
    {
      serviceType: "",
      dates: [{ date: new Date().toISOString().split("T")[0], times: [""] }],
    },
  ]);

  // Error state variables
  const [doctorError, setDoctorError] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/doctorService/get-service/${id}`
        );

        setService(response.data);
        setSelectedDoctor(response.data.doctorName);
        setSelectedHospital(response.data.hospitalName);

        // Populate serviceDetails with existing service data
        const existingServices = response.data.services.map((service) => ({
          serviceType: service.serviceType,
          dates: service.dates.map((date) => ({
            date: formatDate(date.date), // Format the date for display
            times: date.times,
          })),
        }));

        setServiceDetails(
          existingServices.length > 0
            ? existingServices
            : [
                {
                  serviceType: "",
                  dates: [
                    {
                      date: formatDate(new Date().toISOString()),
                      times: [""],
                    },
                  ],
                },
              ]
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/doctor/get-doctors"
        );
        setDoctors(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchHospitals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/hospital/get-hospitals"
        );
        setHospitals(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchAllServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/service/get-services"
        );
        setServicesList(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchService();
    fetchDoctors();
    fetchHospitals();
    fetchAllServices(); // Fetch all services
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD for <input type="date">
  };

  const addService = () => {
    setServiceDetails([
      ...serviceDetails,
      {
        serviceType: "",
        dates: [{ date: formatDate(new Date().toISOString()), times: [""] }],
      },
    ]);
  };

  const removeService = (index) => {
    const updatedServices = serviceDetails.filter((_, i) => i !== index);
    setServiceDetails(updatedServices);
  };

  const handleServiceChange = (index, value) => {
    const updatedServices = [...serviceDetails];
    updatedServices[index].serviceType = value;
    setServiceDetails(updatedServices);
  };

  const handleDateChange = (serviceIndex, dateIndex, value) => {
    const updatedServices = [...serviceDetails];
    updatedServices[serviceIndex].dates[dateIndex].date = value;
    setServiceDetails(updatedServices);
  };

  const handleTimeChange = (serviceIndex, dateIndex, timeIndex, value) => {
    const updatedServices = [...serviceDetails];
    updatedServices[serviceIndex].dates[dateIndex].times[timeIndex] = value;
    setServiceDetails(updatedServices);
  };

  const validateFields = () => {
    let isValid = true;

    setDoctorError("");
    setServiceError("");
    setDateError("");
    setTimeError("");

    if (!selectedDoctor) {
      setDoctorError("Doctor is required.");
      isValid = false;
    }

    serviceDetails.forEach((service, index) => {
      if (!service.serviceType) {
        setServiceError(`Service type is required`);
        isValid = false;
      }

      service.dates.forEach((date, dateIndex) => {
        if (!date.date) {
          setDateError(`Date is required`);
          isValid = false;
        }
        if (!date.times[0]) {
          setTimeError(`Time is required`);
          isValid = false;
        }
      });
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/doctorService/update-service/${id}`,
        {
          doctorName: selectedDoctor,
          hospitalName: selectedHospital,
          services: serviceDetails.map((service) => ({
            serviceType: service.serviceType,
            dates: service.dates.map((date) => ({
              date: convertToApiDateFormat(date.date), // Convert to YYYY-MM-DD for API
              times: date.times,
            })),
          })),
        }
      );
      alert("Service updated successfully!");
      navigate("/admin/view-services"); // Redirect after successful update
    } catch (error) {
      setError(error.message);
    }
  };

  const convertToApiDateFormat = (displayDate) => {
    const [year, month, day] = displayDate.split("-");
    return `${year}-${month}-${day}`; // Correct format for YYYY-MM-DD
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Doctor Name</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="block w-full border rounded p-2"
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor.fullName}>
                {doctor.fullName}
              </option>
            ))}
          </select>
          {doctorError && <p className="text-red-500">{doctorError}</p>}
        </div>
        <div>
          <label className="block mb-2">Hospital Name</label>
          <select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="block w-full border rounded p-2"
          >
            <option value="">Select Hospital</option>
            {hospitals.map((hospital) => (
              <option key={hospital._id} value={hospital.hospitalName}>
                {hospital.hospitalName}
              </option>
            ))}
          </select>
        </div>

        {serviceDetails.map((service, index) => (
          <div key={index} className="border p-4 mb-4 rounded relative">
            <h2 className="text-lg font-semibold">Service {index + 1}</h2>
            <div>
              <label className="block mb-2">Service Type</label>
              <select
                value={service.serviceType}
                onChange={(e) => handleServiceChange(index, e.target.value)}
                className="block w-full border rounded p-2"
              >
                <option value="">Select Service</option>
                {servicesList.map((service) => (
                  <option key={service._id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
              {serviceError && <p className="text-red-500">{serviceError}</p>}
            </div>

            {service.dates.map((date, dateIndex) => (
              <div key={dateIndex} className="flex space-x-4 mt-4">
                <div className="flex-1">
                  <label className="block mb-2">Service Date</label>
                  <input
                    type="date"
                    value={date.date}
                    onChange={(e) =>
                      handleDateChange(index, dateIndex, e.target.value)
                    }
                    className="block w-full border rounded p-2"
                  />
                  {dateError && <p className="text-red-500">{dateError}</p>}
                </div>
                <div className="flex-1">
                  <label className="block mb-2">Service Time</label>
                  <select
                    value={date.times[0]}
                    onChange={(e) =>
                      handleTimeChange(index, dateIndex, 0, e.target.value)
                    }
                    className="block w-full border rounded p-2"
                  >
                    <option value="">Select Time</option>
                    {[...Array(48).keys()].map((i) => {
                      const hour = Math.floor(i / 2);
                      const minute = i % 2 === 0 ? "00" : "30";
                      const timeValue = `${hour
                        .toString()
                        .padStart(2, "0")}:${minute}`;
                      return (
                        <option key={timeValue} value={timeValue}>
                          {timeValue}
                        </option>
                      );
                    })}
                  </select>
                  {timeError && <p className="text-red-500">{timeError}</p>}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => removeService(index)}
              className="absolute top-2 right-2 text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addService}
          className="bg-blue-500 text-white rounded p-2 mr-6"
        >
          Add Another Service
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white rounded p-2 mt-4"
        >
          Update Service
        </button>
      </form>
    </div>
  );
};

export default EditService;
