import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from "./AdminLogin.module.scss";
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../redux/apiClient';
import SchoolIcon from '@mui/icons-material/School';
import { setToken } from '../../../redux/tokenSlice';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { setAdminAuth } from '../../../redux/adminAuthSlice';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function AdminLogin() {
    const [visibility, setVisibility] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleVisibility = () => {
        setVisibility(!visibility);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await apiClient.post('/admin/login', { username, password });
            const result = response.data;

            if (result.success) {
                dispatch(setToken(result.token));
                dispatch(setAdminAuth({ username, token: result.token }));
                navigate('/fac-adm-reg');
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred while trying to log in. Please try again.');
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