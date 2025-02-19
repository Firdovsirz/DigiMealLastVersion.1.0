import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from "./ScannerLogin.module.scss";
import apiClient from '../../../redux/apiClient';
import SchoolIcon from '@mui/icons-material/School';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { setScannerToken, clearScannerToken } from '../../../redux/scannerAuthSlice';

export default function ScannerLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [visibility, setVisibility] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Initialize dispatch

    const handleVisibility = () => {
        setVisibility(!visibility);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            // Use the apiClient for making the login request
            const response = await apiClient.post('/scanner/login', { username, password });

            if (response.data.token) {
                // Dispatch the action to store the token in Redux state
                dispatch(setScannerToken(response.data.token));

                // If login is successful, navigate to the scanner home
                navigate('/scanner-home');
            } else {
                // If login fails, set the error message
                setErrorMessage("Invalid username or password.");
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
        </main>
    );
}
