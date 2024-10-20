import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetScanResult, verifyQR } from "@/redux/scanSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import img from "@/assets/profile.png";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { fetchAppointments } from "@/redux/scanSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateAge } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UpcomingAppointmentsCard from "./UpcomingAppointmentsCard";

export default function PatientDetails() {
  const dispatch = useDispatch();

  const { scannedPatient, scanResult } = useSelector((state) => state.scan);
  const { userAppointments } = useSelector((state) => state.scan);

  console.log(scanResult);
  console.log(userAppointments);

  useEffect(() => {
    dispatch(verifyQR({ patientId: scanResult })).then((res) => {
      console.log("Scanned user", res);
    });
  }, [dispatch, scanResult]);

  useEffect(() => {
    dispatch(fetchAppointments(scannedPatient?.email)).then((res) => {
      console.log("Appointments", res);
    });
  }, [dispatch, scannedPatient?.email]);

  const handleClick = () => {
    dispatch(resetScanResult());
  };

  console.log(userAppointments?.length);

  const age = scannedPatient?.DOB ? calculateAge(scannedPatient?.DOB) : "N/A";

  const pendingPayments = userAppointments.flatMap((appointment) =>
    appointment.appointments
      .filter((appt) => appointment.payment?.status !== "Completed") // Check payment status for each appointment
      .map((appt) => ({
        aid: appointment.AID,
        hospital: appointment.hospital,
        service: appointment.service,
        doctor: appointment.doctor,
        payment: appointment.payment,
        date: appt.date, // Correctly referencing 'appt'
        time: appt.time,
      }))
  );

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

      <Tabs defaultValue="personalDetails" className="w-full">
        <TabsList className="flex justify-between w-full">
          <TabsTrigger value="personalDetails">Personal Details</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="personalDetails">
          <Card className="w-full bg-white shadow-md p-4">
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>First Name:</strong>{" "}
                {scannedPatient?.firstname || "N/A"}
              </p>
              <p>
                <strong>Last Name:</strong> {scannedPatient?.lastname || "N/A"}
              </p>
              <p>
                <strong>Joined Date:</strong>{" "}
                {formatDate(scannedPatient?.created_date) || "N/A"}
              </p>
              <p>
                <strong>Age:</strong> {age}
              </p>
              <p>
                <strong>Last Visited:</strong>{" "}
                {formatDate(scannedPatient?.lastVisited) || "N/A"}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card className="w-full bg-white shadow-md p-4">
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {userAppointments.length === 0 ? (
                <p>No appointments found</p>
              ) : (
                <Table className="min-w-full bg-white border">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="py-2 px-4 border-b">AID</TableHead>
                      <TableHead className="py-2 px-4 border-b">
                        Hospital
                      </TableHead>
                      <TableHead className="py-2 px-4 border-b">
                        Service
                      </TableHead>
                      <TableHead className="py-2 px-4 border-b">
                        Doctor
                      </TableHead>
                      <TableHead className="py-2 px-4 border-b">
                        Amount
                      </TableHead>
                      <TableHead className="py-2 px-4 border-b">Date</TableHead>
                      <TableHead className="py-2 px-4 border-b">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userAppointments.flatMap((appointment) =>
                      appointment.appointments.map((appt) => (
                        <TableRow key={appt._id}>
                          <TableCell className="py-2 border-b">
                            {appointment.AID}
                          </TableCell>
                          <TableCell className="py-2 border-b">
                            {appointment.hospital}
                          </TableCell>
                          <TableCell className="py-2 border-b">
                            {appointment.service}
                          </TableCell>
                          <TableCell className="py-2 border-b">
                            {appointment.doctor}
                          </TableCell>
                          <TableCell className="py-2 px-2 border-b">
                            {appointment.payment?.amount || "N/A"}
                          </TableCell>
                          <TableCell className="py-2 px-2 border-b">
                            {new Date(appt.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="py-2 px-2 border-b">
                            {appt.time.join(", ")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="w-full bg-white shadow-md p-4">
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingPayments.length === 0 ? (
                <p>No pending payments found</p>
              ) : (
                <Table className="min-w-full bg-white border">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="py-2 px-4 border-b">
                        Appointment ID
                      </TableHead>
                      <TableHead className="py-2 px-4 border-b">
                        Amount Due
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.map((appointment, index) => (
                      <TableRow key={index}>
                        <TableCell className="py-2 px-4 border-b">
                          {appointment.aid}
                        </TableCell>
                        <TableCell className="py-2 px-4 border-b">
                          {appointment.payment?.amount || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="w-full bg-white shadow-md">
        <UpcomingAppointmentsCard userAppointments={userAppointments} />
      </Card>

      <Button onClick={handleClick}>Reset</Button>
    </div>
  );
}
