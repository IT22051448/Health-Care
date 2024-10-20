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

  console.log(userAppointments.length);

  const age = scannedPatient?.DOB ? calculateAge(scannedPatient?.DOB) : "N/A";

  const pendingPayments = userAppointments.filter(
    (appointment) => appointment.payment?.status !== "completed"
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
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">AID</th>
                      <th className="py-2 px-4 border-b">Hospital</th>
                      <th className="py-2 px-4 border-b">Service</th>
                      <th className="py-2 px-4 border-b">Doctor</th>
                      <th className="py-2 px-4 border-b">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userAppointments.map((appointment, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">
                          {appointment.aid}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {appointment.hospital}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {appointment.service}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {appointment.doctor}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {appointment.payment?.amount || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Appointment ID</th>
                      <th className="py-2 px-4 border-b">Amount Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPayments.map((appointment, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">
                          {appointment.aid}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {appointment.payment?.amount || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="w-full bg-white shadow-md">
        <CardContent>
          <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
          {/* <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-md font-medium">Emergency Cardiac Care</p>
            <p>Date: 05/10/2024</p>
            <p>Time: 10:00 AM</p>
            <p>Service Amount: Rs. 20,000.00</p>
          </div> */}
          {userAppointments.length === 0 && <p>No appointments found</p>}
        </CardContent>
      </Card>

      <Button onClick={handleClick}>Reset</Button>
    </div>
  );
}
