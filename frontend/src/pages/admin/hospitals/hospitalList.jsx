import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { fetchHospitals } from "@/redux/appointSlice/appointSlice";

function HospitalList() {
  const dispatch = useDispatch();
  const { hospitals } = useSelector((state) => state.appointments);

  console.log(hospitals);

  useEffect(() => {
    dispatch(fetchHospitals());
  }, [dispatch]);

  const handleDelete = (hospitalId) => {
    // Dispatch a delete action or perform delete logic here
    console.log("Deleting hospital with id:", hospitalId);
  };

  const handleUpdate = (hospitalId) => {
    // Dispatch an update action or navigate to the update form here
    console.log("Updating hospital with id:", hospitalId);
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Hospital List</h1>
      <Table>
        <TableCaption>A list of hospitals</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Hospital id</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Hospital Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hospitals.map((hospital) => (
            <TableRow key={hospital.hospitalId}>
              <TableCell>{hospital.hospitalId}</TableCell>
              <TableCell>{hospital.hospitalType}</TableCell>
              <TableCell>{hospital.hospitalName}</TableCell>
              <TableCell>{hospital.address}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    className="bg-blue-500"
                    onClick={() => handleUpdate(hospital.hospitalId)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(hospital.hospitalId)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HospitalList;
