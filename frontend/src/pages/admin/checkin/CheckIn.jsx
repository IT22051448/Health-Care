import { set } from "date-fns";
import QRCodeScanner from "./QRCodeScanner";
import PatientDetails from "./PatientDetails";
import { useState } from "react";
("react");

export default function CheckIn() {
  const [patientId, setPatientId] = useState(null);

  const handleScanSuccess = (scannedData) => {
    setPatientId(scannedData); // Save the scanned patient ID
  };

  return (
    <div className="patient-checkin">
      <h1>Patient Check-In</h1>

      {!patientId ? (
        <QRCodeScanner onScanSuccess={handleScanSuccess} />
      ) : (
        <PatientDetails patientId={patientId} />
      )}
    </div>
  );
}
