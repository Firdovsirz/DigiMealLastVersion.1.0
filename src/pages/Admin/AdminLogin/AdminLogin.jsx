import React, { useState } from 'react';
import styles from "./AdminLogin.module.scss";
import SchoolIcon from '@mui/icons-material/School';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAdminUsername } from '../../../redux/adminAuthSlice'; // Import the action

export default function AdminLogin() {
    const [visibility, setVisibility] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Hook to dispatch Redux actions

    const handleVisibility = () => {
        setVisibility(!visibility);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('http://127.0.0.1:5000/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (result.success) {
            // Update Redux store with the admin username
            dispatch(setAdminUsername(username));

            // Navigate to /fac-adm-reg
            navigate('/fac-adm-reg');
            console.log('logged in');
        } else {
            setError(result.message); // Show error message if login fails
        }
    };

    return (
        <main className={styles['admin-login-main']}>
            <div className={styles['admin-login-main-container']}>
                <div className={styles['admin-login-text']}>
                    <div className={styles['admin-login-text-logo']}>
                        <SchoolIcon style={{
                            color: 'rgb(109, 197, 168)',
                            fontSize: 40,
                            marginRight: 10
                        }} />
                        <h3>DigiMeal</h3>
                    </div>
                    <h2>Admin</h2>
                </div>
                <form onSubmit={handleLogin} className={styles['admin-login-form']}>
                    <div className={styles['admin-login-username-container']}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <div className={styles['admin-login-username-placeholder']}>
                            İstifadəçi adı
                        </div>
                    </div>
                    <div className={styles['admin-login-password-container']}>
                        <input
                            type={visibility ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className={styles['admin-login-password-placeholder']}>
                            Şifrə
                        </div>
                        {visibility ?
                            <VisibilityOffIcon
                                style={{
                                    color: 'rgb(109, 197, 168)',
                                    cursor: 'pointer'
                                }}
                                onClick={handleVisibility} /> :
                            <VisibilityIcon
                                style={{
                                    color: 'rgb(109, 197, 168)',
                                    cursor: 'pointer'
                                }}
                                onClick={handleVisibility} />}
                    </div>
                    {error && <div className={styles['error-message']}>{error}</div>}
                    <button type="submit" className={styles['admin-login-submit-btn']}>Daxil Ol</button>
                </form>
            </div>
        </main>
    );
}