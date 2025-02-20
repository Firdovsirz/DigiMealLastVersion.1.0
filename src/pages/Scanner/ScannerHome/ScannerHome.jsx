import swal from 'sweetalert';
import { useSelector } from "react-redux";
import styles from "./ScannerHome.module.scss";
import { useNavigate } from 'react-router-dom';
import apiClient from "../../../redux/apiClient";
import { Html5QrcodeScanner } from 'html5-qrcode';
import React, { useEffect, useState } from 'react';
import ScannerHeader from '../../../components/Header/ScannerHeader/ScannerHeader';
import ScannerBottomNavigation from '../../../components/BottomNavigation/ScannerBottomNavigation/ScannerBottomNavigation';

export default function ScannerHome() {
    const [message, setMessage] = useState('');
    const [qrId, setQrId] = useState('');
    const [isScanning, setIsScanning] = useState(true);  // Track scanning state
    const [counter, setCounter] = useState(0);  // Counter for 5 seconds delay
    const [bufet, setBufet] = useState('');
    const navigate = useNavigate();
    const [usernamesc, setUsername] = useState('');
    const [error, setError] = useState('');

    // Function to check token expiration

    const getUsernameFromToken = (token) => {
        if (!token) return null;

        try {
            // JWT token format is "header.payload.signature", we split it by dot
            const payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));
            return decodedPayload.username;  // Assuming 'username' is stored in the token
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    // Fetch the username from the token when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('scannerToken'); // Assuming the token is in localStorage

        // If a token exists, extract the username and set it to the 'bufet' state
        if (token) {
            setUsername(getUsernameFromToken(token))
        } else {
            navigate('/scanner-login');
        }
        const fetchUsernameFromBackend = async (usernamesc) => {
            try {
                const response = await apiClient.post('/scanner/get_scanner_username', {
                    usernamesc,
                });

                if (response.data.success) {
                    // Assuming the first result contains the required data
                    setBufet(response.data.results[0].istifadeciadi);
                } else {
                    setError('Username not found');
                }
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };
        fetchUsernameFromBackend(getUsernameFromToken(token))
    }, [navigate]);


    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem("scannerToken");
            if (!token) {
                navigate("/scanner-login", { replace: true });
                return;
            }

            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
                const expirationTime = decodedToken.exp * 1000;  // Expiration time in milliseconds
                const currentTime = Date.now();  // Current time in milliseconds

                if (currentTime >= expirationTime) {
                    localStorage.removeItem("scannerToken");  // Clear expired token from localStorage
                    navigate("/scanner-login", { replace: true });
                }
            } catch (error) {
                console.error("Invalid token format", error);
                localStorage.removeItem("authToken");  // Clear invalid token
                navigate("/scanner-login", { replace: true });
            }
        };
        // Check for token expiration when the component mounts
        checkTokenExpiration();

        // Initialize the QR scanner
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
            body: JSON.stringify({ 
              qr_id: data,
              bufet: bufet 
            }),
          });
          const result = await response.json();
      
          if (response.ok) {
            swal("Success", "Qr uğurla skan olundu yemək əldə edə bilərsiz!", "success");
          } else if (response.status === 404) {
            swal("Error", "Qr artiq skan edilib!", "error");
          } else if (response.status === 400) {
            swal("Error", "Qr kodu yenidən təqdim edin!", "error");
          } else {
            swal("Error", result.message || "An unexpected error occurred", "error");
          }
      
          setMessage(result.message);
        } catch (error) {
          console.error('Error sending QR code data to backend:', error);
          setMessage('Failed to update QR code status.');
          swal("Error", error.message, "error");
        }
      };
      

    return (
        <>
            <ScannerHeader />
            <main className={styles['scanner-home']}>
                <section className={styles['scanner-container']}>
                    <div id="qr-reader" className={styles['qr-reader']}></div>
                    {!isScanning && <p>Skan {counter} saniyə ərzində davam edəcək...</p>}
                </section>
            </main>
            <ScannerBottomNavigation />
        </>
    );
}
