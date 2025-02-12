import { useSelector } from 'react-redux';
import styles from "./ScannerHeader.module.scss";
import apiClient from '../../..//redux/apiClient';
import React, { useEffect, useState } from 'react';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ScannerHeader() {
    // Get the scanner token from Redux state
    const scannerToken = useSelector(state => state.scannerAuth.scannerToken);
    const [usernamesc, setUsername] = useState(null);  // State to store the username
    const [loading, setLoading] = useState(true);  // State for loading indicator
    const [error, setError] = useState(null);  // State for error handling

    // Function to decode the JWT and get the username
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

    // Fetch username from backend
    const fetchUsernameFromBackend = async (usernamesc) => {
        try {
            const response = await apiClient.post('/scanner/get_scanner_username', {
                usernamesc,
            });

            if (response.data.success) {
                // Assuming the first result contains the required data
                setUsername(response.data.results[0].istifadeciadi);
            } else {
                setError('Username not found');
            }
        } catch (error) {
            setError('Failed to fetch username');
            console.error('Error fetching username:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const usernameFromToken = getUsernameFromToken(scannerToken);

        if (usernameFromToken) {
            fetchUsernameFromBackend(usernameFromToken);
        } else {
            setLoading(false);
            setError('No valid token found');
        }
    }, [scannerToken]);  // Re-run when scannerToken changes

    return (
        <header className={styles['scanner-header']}>
            <nav>
                <div className={styles['scanner-header-logo']}>
                    <SchoolIcon style={{
                        color: "rgb(24, 38, 98)",
                        fontSize: 40,
                        marginRight: 20
                    }} />
                    <h2>DigiMeal</h2>
                </div>
                <div className={styles['scanner-header-profile']}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <h3>{usernamesc}</h3>  // Display fetched username or fallback to 'User'
                    )}
                    <AccountCircleIcon style={{
                        color: "rgb(24, 38, 98)",
                        fontSize: 40
                    }} />
                </div>
            </nav>
        </header>
    );
}
