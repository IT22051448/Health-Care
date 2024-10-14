import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctors,
  fetchHospitals,
  fetchAllServices,
  createService,
} from "@/redux/appointSlice/appointSlice";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ScheduleDoctorAppointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    doctors,
    hospitals,
    servicesData: services,
  } = useSelector((state) => state.appointments);
  const { toast } = useToast();

  // State variables to hold selected doctor, hospital, and service details
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [serviceDetails, setServiceDetails] = useState([]);

  useEffect(() => {
    // Fetch doctors, hospitals, and services on component mount
    const fetchData = async () => {
      try {
        await dispatch(fetchDoctors());
        await dispatch(fetchHospitals());
        await dispatch(fetchAllServices());
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          style: { background: "red", color: "white" },
        });
      }
    };
    fetchData();
  }, [dispatch]);

  // Facade Design Pattern: Simplifying interactions with complex logic for fetching data
  // Function to add a new service entry
  const addService = () => {
    setServiceDetails((prev) => [
      ...prev,
      { serviceType: "", dates: [{ date: "", times: [""] }] },
    ]);
    toast({
      title: "Success",
      description: "Service added successfully!",
    });
  };

  // Function to remove a service entry
  const removeService = (index) => {
    const updatedServices = serviceDetails.filter((_, i) => i !== index);
    setServiceDetails(updatedServices);
    toast({
      title: "Service removed",
      description: "The selected service has been removed.",
    });
  };

  // Update service type based on selection
  const handleServiceChange = (index, value) => {
    const updatedServices = [...serviceDetails];
    updatedServices[index].serviceType = value;
    setServiceDetails(updatedServices);
  };

  // Update date for a specific service
  const handleDateChange = (serviceIndex, dateIndex, value) => {
    const updatedServices = [...serviceDetails];
    updatedServices[serviceIndex].dates[dateIndex].date = value;
    setServiceDetails(updatedServices);
  };

  // Update time for a specific service
  const handleTimeChange = (serviceIndex, dateIndex, timeIndex, value) => {
    const updatedServices = [...serviceDetails];
    updatedServices[serviceIndex].dates[dateIndex].times[timeIndex] = value;
    setServiceDetails(updatedServices);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate selected doctor and hospital
    if (!selectedDoctor || !selectedHospital) {
      toast({
        title: "Error",
        description: "Please select both a doctor and a hospital.",
        style: { background: "red", color: "white" },
      });
      return;
    }

    // Validate that at least one service has been added
    if (serviceDetails.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one service.",
        style: { background: "red", color: "white" },
      });
      return;
    }

    // Validate service details
    const invalidServices = serviceDetails.some((service) => {
      const isServiceTypeEmpty = !service.serviceType;
      const hasInvalidDates = service.dates.some((date) => {
        const isDateEmpty = !date.date;
        const isTimeEmpty = !date.times[0]; // Change to validation for specific times
        return isDateEmpty || isTimeEmpty;
      });
      return isServiceTypeEmpty || hasInvalidDates;
    });

    if (invalidServices) {
      toast({
        title: "Error",
        description:
          "Please ensure all service details (type, date, time) are filled in.",
        style: { background: "red", color: "white" },
      });
      return;
    }

    // Prepare payload for service creation
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

    try {
      // Attempt to create service and handle success
      await dispatch(createService(payload));
      toast({
        title: "Success",
        description: "Service created successfully!",
        style: { background: "green", color: "white" },
      });
      navigate("/admin/appointment");
    } catch (error) {
      // Handle errors during service creation
      toast({
        title: "Error",
        description: "Failed to create service. Please try again.",
        style: { background: "red", color: "white" },
      });
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Schedule Doctor Appointments
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Doctor selection */}
        <div>
          <label className="block mb-2 font-medium">Doctor Name</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="block w-full border rounded p-3 shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor.fullName}>
                {doctor.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Hospital selection */}
        <div>
          <label className="block mb-2 font-medium">Hospital Name</label>
          <select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="block w-full border rounded p-3 shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
          >
            <option value="">Select Hospital</option>
            {hospitals.map((hospital) => (
              <option key={hospital._id} value={hospital.hospitalName}>
                {hospital.hospitalName}
              </option>
            ))}
          </select>
        </div>

        {/* Service details input */}
        {serviceDetails.map((service, index) => (
          <div
            key={index}
            className="border border-gray-300 p-4 mb-4 rounded-lg shadow-md relative"
          >
            <h2 className="text-lg font-semibold mb-2">Service {index + 1}</h2>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Service Type</label>
              <select
                value={service.serviceType}
                onChange={(e) => handleServiceChange(index, e.target.value)}
                className="block w-full border rounded p-3 shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service._id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time inputs for the service */}
            {service.dates.map((date, dateIndex) => (
              <div key={dateIndex} className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <label className="block mb-2 font-medium">Service Date</label>
                  <input
                    type="date"
                    value={date.date}
                    onChange={(e) =>
                      handleDateChange(index, dateIndex, e.target.value)
                    }
                    className="block w-full border rounded p-3 shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 font-medium">Service Time</label>
                  <select
                    value={date.times[0]}
                    onChange={(e) =>
                      handleTimeChange(index, dateIndex, 0, e.target.value)
                    }
                    className="block w-full border rounded p-3 shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
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

            {/* Button to remove the service */}
            <button
              type="button"
              onClick={() => removeService(index)}
              className="absolute top-5 right-4 bg-red-500 text-white rounded p-2 hover:bg-red-700 shadow-md"
            >
              Remove Service
            </button>
          </div>
        ))}

        {/* Button to add another service */}
        <button
          type="button"
          onClick={addService}
          className="bg-blue-500 text-white p-3 rounded shadow-md hover:bg-blue-700 transition"
        >
          Add Another Service
        </button>

        {/* Displaying added services */}
        <div className="mt-8">
          <h2 className="text-xl font-bold">Added Services</h2>
          {serviceDetails.map((service, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 mb-4 rounded-lg shadow-md"
            >
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

        {/* Submit button to create services */}
        <button
          type="submit"
          className="bg-green-500 text-white p-3 rounded mt-4 shadow-md hover:bg-green-700 transition"
        >
          Create Services
        </button>
      </form>
    </div>
  );
};

export default ScheduleDoctorAppointments;
