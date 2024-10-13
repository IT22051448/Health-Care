import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

function DoctorProfile() {
  const location = useLocation();
  const { doctor } = location.state || {};

  if (!doctor) return <div>No doctor data available.</div>;

  const handleDelete = () => {
    // Add logic for deleting the doctor's profile
    console.log(`Deleting profile for ${doctor.fullName}`);
  };

  const handleUpdate = () => {
    // Add logic for updating the doctor's profile
    console.log(`Updating profile for ${doctor.fullName}`);
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <img
          src={doctor.image}
          alt={`${doctor.fullName}'s profile`}
          className="w-32 h-32 rounded-full border-2 border-gray-300 shadow-lg mr-4"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {doctor.fullName}
          </h1>
          <p className="text-gray-600">
            <strong>Doctor ID:</strong> {doctor.medicalLicenseNumber}
          </p>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-inner mb-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Details</h2>
        <p className="text-gray-600">
          <strong>Specialization:</strong> {doctor.specialization}
        </p>
        <p className="text-gray-600">
          <strong>Experience:</strong> {doctor.yearsOfExperience} years
        </p>
        <p className="text-gray-600">
          <strong>Contact:</strong> {doctor.phone}
        </p>
        <p className="text-gray-600">
          <strong>Gender:</strong> {doctor.gender}
        </p>
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={handleUpdate}
          className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
        >
          Update Profile
        </Button>
        <Button
          onClick={handleDelete}
          className="bg-red-500 text-white hover:bg-red-600 transition duration-300"
        >
          Delete Profile
        </Button>
      </div>
    </div>
  );
}

export default DoctorProfile;