import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import apiClient from '../../redux/apiClient'; // Axios client
import styles from "../Header/Header.module.scss";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LanguageChanger from '../LanguageChanger/LanguageChanger';

export default function Header() {
    const { t } = useTranslation();
    const globalUsername = useSelector((state) => state.auth.username);
    const token = useSelector((state) => state.token.token); // JWT token from Redux
    const [fullName, setFullName] = useState(globalUsername);
    const [burgerMenu, setBurgerMenu] = useState(true);

    const handleBurgerMenu = () => {
        setBurgerMenu(!burgerMenu);
    };

    const fetchFullName = async () => {
        if (!token) {
            setFullName(globalUsername);
            return;
        }

        try {
            const response = await apiClient.post('/user/get_username', {});
            if (response.data.success) {
                setFullName(response.data.istifadeci_adi);
            } else {
                setFullName(globalUsername); // Fallback to global username
            }
        } catch (error) {
            console.error('Error fetching full name:', error);
            setFullName(globalUsername); // Fallback to global username
        }
    };

    useEffect(() => {
        fetchFullName();
    }, [globalUsername, token]);

    if (!globalUsername) {
        return <p>Please log in to access the dashboard</p>;
    }

    return (
        <header className={styles['user-header']}>
            <nav className={styles['user-nav']}>
                <div className={styles['header-logo']}>
                    <SchoolIcon style={{ color: 'rgb(24, 38, 98)', fontSize: 35, marginRight: 15 }} />
                    <h1>DigiMeal</h1>
                </div>
                <div className={styles['header-pages']}>
                    <ul>
                        <li>
                            <Link
                                to={'/user-page'}
                                state={{ username: globalUsername }}
                                className={styles['header-page-link-qr']}>
                                {t("header-qr-generate", { ns: "header" })}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={'/user-page/history'}
                                state={{ username: globalUsername }}
                                className={styles['header-page-link-history']}>
                                {t("header-history", { ns: "header" })}
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={styles['user-header-profile']}>
                    <p>{fullName}</p>
                    <AccountCircleIcon
                        onClick={handleBurgerMenu}
                        style={{
                            color: 'rgb(24, 38, 98)',
                            fontSize: 40,
                            cursor: 'pointer',
                        }}
                    />
                    {window.innerWidth > 600 && <LanguageChanger position={'relative'} top={0} right={-40} />}
                </div>
                <div className={styles['burger-menu']} style={burgerMenu ? { marginRight: '-250px' } : { marginRight: 0 }}>
                    <div className={styles['burger-menu-close-icon-container']}>
                        <CloseIcon className={styles['burger-menu-close-icon']} onClick={handleBurgerMenu} />
                        <div className={styles['burger-menu-digimeal-logo']}>
                            <SchoolIcon style={{ color: '#fff', fontSize: 30, marginRight: 10 }} />
                            <p>DigiMeal</p>
                        </div>
                    </div>
                    <div className={styles['burger-menu-profile-info']}>
                        <h3>{fullName}</h3>
                    </div>
                    <div className={styles['burger-menu-pages']}>
                        <ul>
                            <li>{t("header-qr-generate", { ns: "header" })}</li>
                            <li>{t("header-history", { ns: "header" })}</li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}