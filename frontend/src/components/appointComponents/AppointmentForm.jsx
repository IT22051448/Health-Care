import React, { useState } from "react";
import DateTimePickerModal from "./DateTimePickerModal";

const AppointmentForm = () => {
  const [hospital, setHospital] = useState("");
  const [service, setService] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [datesAndTimes, setDatesAndTimes] = useState([]);
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    age: "",
    gender: "",
    description: "",
  });
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const handleDateTimePickerSubmit = (selectedDates) => {
    setDatesAndTimes(selectedDates);
    setShowDateTimePicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const appointmentData = {
      hospital,
      service,
      doctorName,
      appointmentDates: datesAndTimes.map((dt) => ({
        date: new Date(dt.date), // Ensure date is in Date format
        time: dt.time,
      })),
      patient: {
        name: patientDetails.name,
        age: patientDetails.age,
        gender: patientDetails.gender,
        description: patientDetails.description,
      },
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/appoint/create-appointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Appointment created successfully:", result);
      // Optionally, reset form or show success message
    } catch (error) {
      console.error("Error creating appointment:", error);
      // Handle error, e.g., show an error message to the user
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-10 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-3xl font-bold text-[#6F93D9] mb-6 text-center">
        New Appointment
      </h1>

      {/* Hospital and Service Selection */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Hospital
          </label>
          <select
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select Hospital
            </option>
            <option value="government">Government</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Select Service
          </label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select Service
            </option>
            <option value="general-consultation">General Consultation</option>
            <option value="pediatric-care">Pediatric Care</option>
            <option value="gynecology">Gynecology</option>
            <option value="orthopedics">Orthopedics</option>
            <option value="cardiology">Cardiology</option>
            <option value="dermatology">Dermatology</option>
            <option value="nutrition-counseling">Nutrition Counseling</option>
            <option value="physiotherapy">Physiotherapy</option>
            <option value="psychology">Psychology</option>
            <option value="immunization">Immunization</option>
            <option value="chronic-disease-management">
              Chronic Disease Management
            </option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Select Specializing Doctor
        </label>
        <input
          type="text"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-md"
          placeholder="Enter Doctor's Name"
        />
      </div>

      {/* Appointment Dates Summary */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-2">Selected Appointments</h2>
        <ul className="border border-gray-300 rounded-md p-4 bg-gray-50 max-h-40 overflow-auto">
          {datesAndTimes.length === 0 ? (
            <li className="text-sm text-gray-500">
              No appointments selected yet
            </li>
          ) : (
            datesAndTimes.map((dt, index) => (
              <li key={index} className="text-sm">
                {dt.date} - {dt.time}
              </li>
            ))
          )}
        </ul>
        <button
          onClick={() => setShowDateTimePicker(true)}
          className="bg-[#6F93D9] text-white mt-3 py-3 px-6 rounded-md w-full"
        >
          Set Appointments
        </button>
      </div>

      {/* Patient Details */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Full Name</label>
        <input
          type="text"
          value={patientDetails.name}
          onChange={(e) =>
            setPatientDetails({ ...patientDetails, name: e.target.value })
          }
          className="block w-full p-3 border border-gray-300 rounded-md"
          placeholder="Enter Name"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Age</label>
          <input
            type="number"
            value={patientDetails.age}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, age: e.target.value })
            }
            className="block w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter Age"
          />
        </div>

        {/* Gender Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Gender</label>
          <div className="grid grid-cols-3 gap-2">
            {["male", "female", "other"].map((gender) => (
              <button
                key={gender}
                className={`p-3 rounded-md ${
                  patientDetails.gender === gender
                    ? "bg-[#6F93D9] text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setPatientDetails({ ...patientDetails, gender })}
              >
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={patientDetails.description}
          onChange={(e) =>
            setPatientDetails({
              ...patientDetails,
              description: e.target.value,
            })
          }
          className="block w-full p-3 border border-gray-300 rounded-md"
          placeholder="Describe your problem"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-[#6F93D9] text-white py-3 px-6 rounded-md w-full text-lg font-medium"
      >
        Create Appointment(s)
      </button>

      {showDateTimePicker && (
        <DateTimePickerModal
          onSubmit={handleDateTimePickerSubmit}
          onClose={() => setShowDateTimePicker(false)}
        />
      )}
    </div>
  );
};

export default AppointmentForm;
