import React, { useState } from 'react';
import axios from 'axios';
import styles from "./ScannerLogin.module.scss";
import SchoolIcon from '@mui/icons-material/School';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function ScannerLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [visibility, setVisibility] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [scannerDetails, setScannerDetails] = useState(null);

    const handleVisibility = () => {
        setVisibility(!visibility);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            // Attempt login
            const loginResponse = await axios.post('http://127.0.0.1:5000/scanner/login', {
                username,
                password
            });

            if (loginResponse.data.success) {
                // Fetch scanner details after successful login
                const detailsResponse = await axios.post(
                    'http://127.0.0.1:5000/scanner/get_scanner_username',
                    { usernamesc: username }
                );

                if (detailsResponse.data.success) {
                    setScannerDetails(detailsResponse.data.results[0]);
                } else {
                    setErrorMessage(detailsResponse.data.message);
                }
            } else {
                setErrorMessage(loginResponse.data.message);
            }
        } catch (err) {
            setErrorMessage("An error occurred while logging in.");
        }
    };

    return (
        <main className={styles['scanner-login-main']}>
            <section className={styles['scanner-login-head-txt']}>
                <SchoolIcon style={{ fontSize: 40, color: "rgb(24, 38, 98)" }} />
                <h1>DigiMeal</h1>
            </section>
            <section className={styles['scanner-login-form-container']}>
                <form onSubmit={handleLogin}>
                    <div className={styles['sc-login-form-username-label']}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <div className={styles['sc-login-form-username-placeholder']}>İstifadəçi adı</div>
                    </div>
                    <div className={styles['sc-login-form-password-label']}>
                        <input
                            type={!visibility ? "password" : "text"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className={styles['sc-login-form-password-placeholder']}>Şifrə</div>
                        {visibility ? (
                            <VisibilityOffIcon
                                onClick={handleVisibility}
                                style={{ color: "rgb(24, 38, 98)", cursor: "pointer" }}
                            />
                        ) : (
                            <VisibilityIcon
                                onClick={handleVisibility}
                                style={{ color: "rgb(24, 38, 98)", cursor: "pointer" }}
                            />
                        )}
                    </div>
                    <button type="submit">Daxil Ol</button>
                </form>

            </section>
            {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
            {scannerDetails && (
                <div className={styles['scanner-details']}>
                    <p><strong>Ad:</strong> {scannerDetails.istifadeciadi}</p>
                    <p><strong>Fakültə:</strong> {scannerDetails.faculty}</p>
                </div>
            )}
        </main>
    );
}