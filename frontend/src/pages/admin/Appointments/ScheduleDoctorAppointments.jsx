import React, { useEffect, useState } from "react";
import axios from "axios";

const ScheduleDoctorAppointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [serviceDetails, setServiceDetails] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/doctor/get-doctors"
      );
      setDoctors(response.data);
    };

    const fetchHospitals = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/hospital/get-hospitals"
      );
      setHospitals(response.data);
    };

    const fetchServices = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/service/get-services"
      );
      setServices(response.data);
    };

    fetchDoctors();
    fetchHospitals();
    fetchServices();
  }, []);

  const addService = () => {
    setServiceDetails([
      ...serviceDetails,
      { serviceType: "", dates: [{ date: "", times: [""] }] },
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (serviceDetails.length === 0) {
      alert("Please add at least one service before submitting.");
      return;
    }

    const payload = {
      doctorName: selectedDoctor,
      hospitalName: selectedHospital,
      services: serviceDetails.map((service) => ({
        serviceType: service.serviceType,
        serviceAmount:
          services.find((s) => s.name === service.serviceType)?.amount || 0,
        dates: service.dates,
      })),
    };

    await axios.post(
      "http://localhost:5000/api/doctorService/create-service",
      payload
    );
    alert("Service created successfully!");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Schedule Doctor Appointments</h1>
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
                {services.map((service) => (
                  <option key={service._id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
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
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => removeService(index)}
              className="absolute top-5 right-4 bg-red-500 text-white rounded p-1 hover:bg-red-700"
            >
              Remove Service
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addService}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Another Service
        </button>
      </form>

      {/* Display added services in cards */}
      <div className="mt-8">
        <h2 className="text-xl font-bold">Added Services</h2>
        {serviceDetails.map((service, index) => (
          <div key={index} className="border p-4 mb-4 rounded">
            <h3 className="font-semibold">{service.serviceType}</h3>
            <p>
              Amount: Rs.
              {services.find((s) => s.name === service.serviceType)?.amount ||
                0}
            </p>
            {service.dates.map((date, dateIndex) => (
              <div key={dateIndex} className="mt-2">
                <span>Date: {date.date}</span>
                <span> | Times: {date.times.join(", ")}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white p-2 rounded mt-4"
        onClick={handleSubmit}
      >
        Create Services
      </button>
    </div>
  );
};

export default ScheduleDoctorAppointments;
