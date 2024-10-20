import QRCodeScanner from "./QRCodeScanner";
import PatientDetails from "./PatientDetails";
import { useSelector } from "react-redux";
("react");

export default function CheckIn() {
  const { scanResult } = useSelector((state) => state.scan);

  console.log(scanResult);

  return <>{!scanResult ? <QRCodeScanner /> : <PatientDetails />}</>;
}
