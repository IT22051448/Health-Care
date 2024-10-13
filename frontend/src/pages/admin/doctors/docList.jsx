import React, { useEffect } from "react";
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

function DocList() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { doctors, loading } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const handleViewProfile = (doctor) => {
    navigate(`profile/${doctor._id}`, { state: { doctor } });
  };

  return (
    <div className="container mx-auto mt-10">
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
            <TableHead>Actions</TableHead> {/* Added Actions header */}
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
                  onClick={() => handleViewProfile(doctor)} // Pass the entire doctor object
                >
                  View Profile
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DocList;
