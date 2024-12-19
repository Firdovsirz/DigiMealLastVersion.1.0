import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import apiClient from '../../redux/apiClient';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import {clearToken} from "../../redux/tokenSlice";
import styles from "../Header/Header.module.scss";
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect } from 'react';
import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import { clearUsername } from '../../redux/authSlice';
import LanguageChanger from '../LanguageChanger/LanguageChanger';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Header() {
    const { t } = useTranslation();
    const globalUsername = useSelector((state) => state.auth.username);
    const token = useSelector((state) => state.token.token);
    const [fullName, setFullName] = useState(globalUsername);
    const [burgerMenu, setBurgerMenu] = useState(true);
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(clearToken());
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        navigate("/", { replace: true });
      };
    const handleBurgerMenu = () => {
        setBurgerMenu(!burgerMenu);
    };

    const fetchFullName = async () => {
        if (!token) {
            console.warn('No token available. Using global username.');
            setFullName(globalUsername);
            return;
        }

        try {
            const response = await apiClient.post('/user/username', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setFullName(response.data.istifadeci_adi);
            } else {
                console.warn('Failed to fetch full name. Using global username.');
                setFullName(globalUsername);
            }
        } catch (error) {
            console.error('Error fetching full name:', error);
            setFullName(globalUsername);
        }
    };

    useEffect(() => {
        fetchFullName();
    }, [globalUsername, token]);

    if (!token || !globalUsername) {
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
                    {/* {window.innerWidth > 600 && <LanguageChanger position={'relative'} top={0} right={-40} />} */}
                </div>
                <div className={styles['nav-log-out']} onClick={handleLogout}>
                    <LogoutIcon className={styles['nav-log-out-icon']} />
                    <p className={styles['nav-log-out-txt']}>Log Out</p>
                </div>
                <div className={styles['burger-menu']} style={burgerMenu ? { marginRight: '-250px' } : { marginRight: 0 }}>
                    <div className={styles['burger-menu-main-container']}>
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
                    <div className={styles['burger-menu-log-out']}>
                        <LogoutIcon className={styles['burger-log-out-icon']} />
                        <p className={styles['log-out-btn']}>Log Out</p>
                    </div>
                </div>
            </nav>
        </header>
    );
}