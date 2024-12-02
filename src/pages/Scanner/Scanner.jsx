import styles from "./Scanner.module.scss";
import SchoolIcon from '@mui/icons-material/School';
import CropFreeIcon from '@mui/icons-material/CropFree';
import React, { useEffect, useRef, useState } from 'react';

export default function Scanner() {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    // Access the webcam
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    startWebcam();

    return () => {
      // Cleanup webcam stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleQrDetection = (data) => {
    setQrData(data);
    setIsScanning(false); // Stop scanning once QR is detected
  };

  // QR Code scanning logic can be implemented here using an external library (e.g., `jsQR` or OpenCV)
  // You can use `handleQrDetection` to update the state with QR code data

  return (
    <main className={styles['scaner-page-main']}>
      <div className={styles['scaner-container']}>
        <h1>
          <SchoolIcon style={{ fontSize: 40, color: "rgb(24, 38, 98)", marginRight: 20 }} />
          DigiMeal
        </h1>
        <p>Skaner</p>
        <div className={styles['icon-container']}>
          <video
            style={{ borderRadius: 20 }}
            ref={videoRef}
            className={styles['video-feed']}
            autoPlay
            muted
            onPlay={() => setIsScanning(true)}
            onPause={() => setIsScanning(false)}
          />
        </div>
        {qrData && (
          <div className={styles['qr-result']}>
            <p>QR Code Data: {qrData}</p>
          </div>
        )}
      </div>
    </main>
  );
}