//
import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchHospitals } from "@/redux/appointSlice/appointSlice";
import {
  createHospital,
  deleteHospital,
} from "@/redux/hospitalSlice/hospitalSLice";
import { useToast } from "@/hooks/use-toast";

function HospitalList() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { hospitals, loading } = useSelector((state) => state.appointments);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    hospitalId: "",
    hospitalType: "",
    hospitalName: "",
    address: "",
    image: "",
  });

  useEffect(() => {
    dispatch(fetchHospitals());
  }, [dispatch]);

  const handleDelete = (hospitalId) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      dispatch(deleteHospital(hospitalId))
        .unwrap()
        .then(() => {
          toast({ title: "Hospital deleted successfully", description: "" });
        })
        .catch((error) => {
          toast({ title: "Error deleting hospital", description: error });
        });
    }
  };

  const handleUpdate = (hospitalId) => {
    console.log("Updating hospital with id:", hospitalId);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddHospital = () => {
    dispatch(createHospital(formData));
    setOpen(false);
    setFormData({
      hospitalId: "",
      hospitalType: "",
      hospitalName: "",
      address: "",
      image: "",
    });
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <Button onClick={() => setOpen(true)}>Add New Hospital</Button>

      <h1 className="text-2xl font-bold mb-4">Hospital List</h1>
      <Table>
        <TableCaption>A list of hospitals</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Hospital ID</TableHead>
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
                    onClick={() => handleUpdate(hospital._id)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(hospital._id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Hospital</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="hospitalId"
              placeholder="Hospital ID"
              value={formData.hospitalId}
              onChange={handleChange}
            />
            <Input
              name="hospitalType"
              placeholder="Hospital Type"
              value={formData.hospitalType}
              onChange={handleChange}
            />
            <Input
              name="hospitalName"
              placeholder="Hospital Name"
              value={formData.hospitalName}
              onChange={handleChange}
            />
            <Input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
            <Input
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
            />
            <Button onClick={handleAddHospital}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HospitalList;
