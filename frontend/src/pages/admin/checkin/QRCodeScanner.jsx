import { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import PropTypes from "prop-types";

const QRCodeScanner = () => {
  const scanner = useRef();
  const videoRef = useRef(null);

  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    const onScanSuccess = (result) => {
      setScannedData(result);
      if (scanner.current) {
        scanner.current.stop(); // Stop scanning after successful scan
        console.log("Scanner stopped after successful scan.");
      }
    };

    if (videoRef?.current && !scanner.current) {
      scanner.current = new QrScanner(videoRef.current, onScanSuccess, {
        onDecodeError: (err) => {
          console.log(err);
        },
        highlightScanRegion: true,
        highlightCodeOutline: true,
      });

      scanner.current.start().catch((err) => {
        console.log(err);
      });

      return () => {
        if (scanner?.current) {
          scanner?.current?.stop();
        }
      };
    }
  }, []);

  return (
    <div className="qr-code-scanner">
      <h2>Scan Patient QR Code</h2>
      <video ref={videoRef} style={{ width: "100%", height: "auto" }} />

      {scannedData && <p>Scann success!</p>}
    </div>
  );
};

// prop validation
QRCodeScanner.propTypes = {
  onScanSuccess: PropTypes.func.isRequired,
};

export default QRCodeScanner;
