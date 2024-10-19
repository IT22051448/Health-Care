import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetScanResult, verifyQR } from "@/redux/scanSlice";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import img from "@/assets/doctor.jpg";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { fetchAppointments } from "@/redux/appointSlice/appointSlice";

export default function PatientDetails() {
  const dispatch = useDispatch();

  const { scannedPatient, scanResult } = useSelector((state) => state.scan);
  const { appointments } = useSelector((state) => state.appointments);

  console.log(scannedPatient);
  console.log(appointments);

  useEffect(() => {
    dispatch(verifyQR({ scanResult })).then((res) => {
      console.log(res);
    });
  }, [dispatch, scanResult]);

  useEffect(() => {
    dispatch(fetchAppointments(scannedPatient?.email)).then((res) => {
      console.log("Scanned user appointments", res);
    });
  }, [dispatch, scannedPatient.email]);

  const handleClick = () => {
    dispatch(resetScanResult());
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100  space-y-6 px-6">
      <Card className="w-full  bg-white shadow-md">
        <CardHeader className="flex flex-row items-center space-x-4 p-4">
          <img src={img} alt="profile" className="w-20 h-20 rounded-full" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">
              {scannedPatient?.firstname} {scannedPatient?.lastname}
            </h2>
            <p className="text-gray-500">
              Memeber Since: {formatDate(scannedPatient?.created_date)}
            </p>
            <p>Last Visited: {formatDate(scannedPatient?.lastVisited)}</p>
          </div>
        </CardHeader>
      </Card>

      <div className="flex justify-between w-full ">
        <Button variant="outline">Personal Details</Button>
        <Button variant="outline">Appointments</Button>
        <Button variant="outline">Payments</Button>
      </div>

      <Card className="w-full bg-white shadow-md">
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

      <Button onClick={handleClick}>Reset</Button>
    </div>
  );
}
