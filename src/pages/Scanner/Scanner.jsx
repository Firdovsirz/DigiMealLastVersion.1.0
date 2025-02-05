import axios from 'axios';
import styles from "./Scanner.module.scss";
import React, { useEffect, useRef, useState } from 'react';
import ScannerHeader from "../../components/Header/ScannerHeader/ScannerHeader";
import ScannerBottomNavigation from "../../components/BottomNavigation/ScannerBottomNavigation/ScannerBottomNavigation";

export default function Scanner() {
  const [isReady, setIsReady] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);

  const handleScan = async (qrData) => {
    if (qrData && isReady) {
      setScanResult(qrData);
      setIsReady(false);
  
      try {
        const response = await axios.post('http://127.0.0.1:5000/update-status', { qr_id: qrData });
        if (response.data.success) {
          alert(`QR Code processed: ${qrData}`);
        } else {
          alert(`Error processing QR Code: ${response.data.message}`);
        }
      } catch (error) {
        setErrorMessage('Failed to communicate with the server.');
        console.error(error);
      }
  
      setTimeout(() => setIsReady(true), 15000);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setErrorMessage('Failed to access the camera.');
      console.error(error);
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg');
      
      axios.post('http://127.0.0.1:5000/scan-qr', { image: imageData })
        .then(response => {
          if (response.data.qr_code) {
            handleScan(response.data.qr_code);
          } else {
            setErrorMessage('QR Code not detected.');
          }
        })
        .catch(error => {
          console.error(error);
          setErrorMessage('Error while scanning QR code.');
        });
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (cameraStream) {
        const tracks = cameraStream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isReady) {
        captureFrame();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady]);

  return (
    <>
      <ScannerHeader />
      <main className={styles['scanner-page-main']}>
        <div className={styles['scanner-container']}>
          {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
          
          <video ref={videoRef} autoPlay muted style={{ width: '50%', height: '400px' }} />
          
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {scanResult && <p>Last scanned QR Code: {scanResult}</p>}
        </div>
      </main>
      <ScannerBottomNavigation />
    </>
  );
}