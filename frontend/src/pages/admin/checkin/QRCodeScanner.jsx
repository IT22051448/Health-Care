import { useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import PropTypes from "prop-types";

const QRCodeScanner = ({ onScanSuccess }) => {
  const scanner = useRef();
  const videoRef = useRef(null);

  const handleScan = (result) => {
    console.log(result);

    const data = result.data;

    if (!data.startsWith("A")) {
      alert("Invalid QR Code");
      return;
    }
    scanner.current.stop();
    onScanSuccess(data);
  };

  useEffect(() => {
    if (videoRef?.current && !scanner.current) {
      scanner.current = new QrScanner(videoRef.current, handleScan, {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      });

      scanner.current.start().catch((err) => {
        console.log(err);
      });

      return () => {
        scanner.current.stop();
      };
    }
  }, [onScanSuccess]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Scan Patient QR Code</h2>
      <video
        ref={videoRef}
        className="w-full md:w-screen h-auto mb-4 rounded-lg border"
      />
    </div>
  );
};

// prop validation
QRCodeScanner.propTypes = {
  onScanSuccess: PropTypes.func.isRequired,
};

export default QRCodeScanner;
