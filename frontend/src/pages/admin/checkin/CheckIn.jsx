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
    <>
      {!patientId ? (
        <QRCodeScanner onScanSuccess={handleScanSuccess} />
      ) : (
        <PatientDetails patientId={patientId} />
      )}
    </>
  );
}
