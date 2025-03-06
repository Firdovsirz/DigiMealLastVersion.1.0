import React, { useState } from 'react';
import apiClient from '../../redux/apiClient';
import styles from "./UserPasswordCreater.module.scss";

export default function UserPasswordCreater() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");

    const handleOtpChange = (e) => {
        const value = e.target.value;
        if (/^[0-9]{0,6}$/.test(value)) {
            setOtp(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            const response = await apiClient.post("/verify-otp", { username, password, otp });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <main className={styles['user-pass-creater-main']}>
            <div className={styles['user-pass-creater-form-container']}>
                <h1>DigiMeal</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder='İstifadəçi adı' 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder='Şifrə' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder='Şifrəni təsdiqlə' 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder='OTP'
                        value={otp}
                        onChange={handleOtpChange}
                        maxLength="6"
                        required
                    />
                    <button type="submit">Təsdiq et</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </main>
    );
}