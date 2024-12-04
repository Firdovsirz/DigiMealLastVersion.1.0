import axios from 'axios';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import styles from "../Header/Header.module.scss";
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LanguageChanger from '../LanguageChanger/LanguageChanger';

export default function Header() {
    const location = useLocation();
    const { username } = location.state || {};
    const [backendUsername, setBackendUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [burgerMenu, setBurgerMenu] = useState(false);
    useEffect(() => {
        if (username) {
            axios
                .post('http://127.0.0.1:5000/get_username', { username })
                .then(response => {
                    if (response.data.success) {
                        setBackendUsername(response.data.istifadeci_adi);
                    } else {
                        setError(response.data.message);
                    }
                })
                .catch(err => setError('Failed to fetch username.'))
                .finally(() => setLoading(false));
        } else {
            setError('No username provided.');
            setLoading(false);
        }
    }, [username]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    return (
        <header className={styles['user-header']}>
            <nav className={styles['user-nav']}>
                <div className={styles['header-logo']}>
                    <SchoolIcon style={{ color: 'rgb(24, 38, 98', fontSize: 35, marginRight: 15 }} />
                    <h1>DigiMeal</h1>
                </div>
                <div className={styles['header-pages']}>
                    <ul>
                        <li>Qr Code Generate</li>
                        <li>History</li>
                    </ul>
                </div>
                <div className={styles['user-header-profile']}>
                    <p>{backendUsername}</p>
                    <AccountCircleIcon
                        style={{
                            color: 'rgb(24, 38, 98',
                            fontSize: 40,
                            marginLeft: 15,
                            cursor: 'pointer',
                            marginRight: 30
                        }} />
                    {window.innerWidth > 600 ? <LanguageChanger
                        position={'relative'}
                        top={0}
                        right={0}
                    /> : null}
                </div>
                <div className={styles['burger-menu']}>
                    <div className={styles['burger-profile-info']}>
                        <p>{backendUsername}</p>
                    </div>
                    <div className={styles['burger-pages']}>
                        <ul>
                            <li>Generate Qr</li>
                            <li>History</li>
                        </ul>
                    </div>
                    <LanguageChanger
                        position={'fixed'}
                        top={500}
                        bottom={'40px'} />
                </div>
            </nav>
        </header>
    )
}
