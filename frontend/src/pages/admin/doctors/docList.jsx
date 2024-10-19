import React, { useEffect, useState } from "react";
import { addDoctor, resetAddDoctorState } from "@/redux/docSlice/docSlice";
import { fetchDoctors } from "@/redux/appointSlice/appointSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function DocList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { doctors, loading, addDoctorSuccess } = useSelector(
    (state) => state.appointments
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "male",
    specialization: "",
    medicalLicenseNumber: "",
    email: "",
    phone: "",
    yearsOfExperience: "",
    image: "",
  });

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (addDoctorSuccess) {
      setIsModalOpen(false); 
      dispatch(resetAddDoctorState()); 
    }
  }, [addDoctorSuccess, dispatch]);

  if (loading) return <div>Loading...</div>;

  const handleViewProfile = (doctor) => {
    navigate(`profile/${doctor._id}`, { state: { doctor } });
  };

  const handleAddDoctor = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addDoctor({ ...formData })).then((data) => {
      if (data) {
        toast({
          title: "Doctor added successfully",
        });
        setIsModalOpen(false);
      }
    });
  };

  return (
    <div className="container mx-auto mt-10">
      <Button onClick={handleAddDoctor}>Add New Doctor</Button>

      <h1 className="text-2xl font-bold mb-4">Doctor List</h1>
      <Table>
        <TableCaption>All doctors.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Doctor ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Exp.</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor._id}>
              <TableCell className="font-medium">
                {doctor.medicalLicenseNumber}
              </TableCell>
              <TableCell>{doctor.fullName || "N/A"}</TableCell>
              <TableCell>{doctor.specialization || "N/A"}</TableCell>
              <TableCell>{doctor.yearsOfExperience || "N/A"}</TableCell>
              <TableCell>{doctor.phone || "N/A"}</TableCell>
              <TableCell>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleViewProfile(doctor)}
                >
                  View Profile
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for adding a new doctor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add New Doctor</h2>
            <form onSubmit={handleSubmit}>
              {/* Form fields */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Medical License Number
                </label>
                <input
                  type="text"
                  name="medicalLicenseNumber"
                  value={formData.medicalLicenseNumber}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button type="submit" className="ml-2">
                  Add Doctor
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocList;
