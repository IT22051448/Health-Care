import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { verifyQR } from "@/redux/scanSlice";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import img from "@/assets/doctor.jpg";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function PatientDetails({ patientId }) {
  const dispatch = useDispatch();

  const { scannedPatient } = useSelector((state) => state.scan);

  console.log(scannedPatient);

  useEffect(() => {
    dispatch(verifyQR({ patientId })).then((res) => {
      console.log(res);
    });
  }, [dispatch, patientId]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 w-full space-y-6">
      <Card className="w-full max-w-lg bg-white shadow-md">
        <CardHeader className="flex flex-row items-center space-x-4 p-4">
          <img src={img} alt="profile" className="w-20 h-20 rounded-full" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">
              {scannedPatient.firstname} {scannedPatient.lastname}
            </h2>
            <p className="text-gray-500">
              Memeber Since: {formatDate(scannedPatient.created_date)}
            </p>
            <p>Last Visited: {formatDate(scannedPatient.lastVisited)}</p>
          </div>
        </CardHeader>
      </Card>

      <div className="flex space-x-4">
        <Button variant="outline">Personal Details</Button>
        <Button variant="outline">Appointments</Button>
        <Button variant="outline">Payments</Button>
      </div>

      <Card className="w-full max-w-lg bg-white shadow-md">
        <CardContent>
          <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-md font-medium">Emergency Cardiac Care</p>
            <p>Date: 05/10/2024</p>
            <p>Time: 10:00 AM</p>
            <p>Service Amount: Rs. 20,000.00</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// prop validation
PatientDetails.propTypes = {
  patientId: PropTypes.string.isRequired,
};
