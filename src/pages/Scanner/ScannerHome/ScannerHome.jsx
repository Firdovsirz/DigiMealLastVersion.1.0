import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import styles from "./ScannerHome.module.scss";
import ScannerHeader from '../../../components/Header/ScannerHeader/ScannerHeader';
import ScannerBottomNavigation from '../../../components/BottomNavigation/ScannerBottomNavigation/ScannerBottomNavigation';

export default function ScannerHome() {
    const [message, setMessage] = useState('');
    const [qrId, setQrId] = useState('');
    const [isScanning, setIsScanning] = useState(true);  // Track scanning state
    const [counter, setCounter] = useState(0);  // Counter for 5 seconds delay

    useEffect(() => {
        // Initialize the scanner manually without the scan button
        const scanner = new Html5QrcodeScanner("qr-reader", { 
            fps: 10, 
            qrbox: 250,
            rememberLastUsedCamera: true, // Optional: Remember the last used camera
            hideScanButton: true, // Hide the scan button (this should automatically hide the button)
        });

        // Function to handle QR code decoding
        const handleDecode = (decodedText) => {
            if (!isScanning) return;  // Prevent scanning if it's paused

            setQrId(decodedText);
            setMessage('QR Code scanned! Processing...');
            sendToBackend(decodedText);

            // Start 5 seconds delay
            setIsScanning(false);
            setCounter(5);

            const countdown = setInterval(() => {
                setCounter((prev) => {
                    if (prev === 1) {
                        clearInterval(countdown);
                        setIsScanning(true);  // Resumes scanning after 5 seconds
                        setMessage('You can scan again!');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000); // Update counter every second
        };

        // Function to handle error during scanning
        const handleError = (errorMessage) => {
            console.warn('QR scan error:', errorMessage);
            setMessage('Xəta baş verdi yenidən cəhd edin!');
        };

        // Start the scanner render (camera starts automatically)
        scanner.render(handleDecode, handleError);

        // Cleanup the scanner on unmount
        return () => {
            scanner.clear();
        };
    }, [isScanning]); // Re-run the effect only when isScanning changes

    const sendToBackend = async (data) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/scannerscan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ qr_id: data }),
            });
            console.log(data);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setMessage(result.message);
        } catch (error) {
            console.error('Error sending QR code data to backend:', error);
            setMessage('Failed to update QR code status.');
        }
    };

    return (
        <>
            <ScannerHeader />
            <main className={styles['scanner-home']}>
                <section className={styles['scanner-container']} style={{display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%'}}>
                    <div id="qr-reader" style={{ width: '100%', height: "400px" }}></div>
                    {!isScanning && <p>Skan {counter} saniyə ərzində davam edəcək...</p>}  {/* Display countdown */}
                </section>
            </main>
            <ScannerBottomNavigation />
        </>
    );
}