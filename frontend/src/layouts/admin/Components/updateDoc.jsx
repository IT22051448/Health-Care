import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const UpdateDoctorModal = ({ isOpen, onClose, doctor, onUpdate }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (doctor) {
      setFormData({
        fullName: doctor.fullName,
        medicalLicenseNumber: doctor.medicalLicenseNumber,
        specialization: doctor.specialization,
        yearsOfExperience: doctor.yearsOfExperience,
        phone: doctor.phone,
        gender: doctor.gender,
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData); // Send updated form data to parent component
    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10">
        <h2 className="text-2xl font-bold mb-4">Update Doctor</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="medicalLicenseNumber">
              Medical License Number
            </label>
            <input
              type="text"
              id="medicalLicenseNumber"
              name="medicalLicenseNumber"
              value={formData.medicalLicenseNumber}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="specialization">
              Specialization
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="yearsOfExperience">
              Years of Experience
            </label>
            <input
              type="number"
              id="yearsOfExperience"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="phone">
              Contact
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-300"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 text-white">
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDoctorModal;
 