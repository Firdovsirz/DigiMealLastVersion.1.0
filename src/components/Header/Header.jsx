import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import apiClient from '../../redux/apiClient';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import { clearToken } from "../../redux/tokenSlice";
import styles from "../Header/Header.module.scss";
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect } from 'react';
import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import { clearUsername } from '../../redux/authSlice';
import LanguageChanger from '../LanguageChanger/LanguageChanger';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
    const { t } = useTranslation();
    const globalUsername = useSelector((state) => state.auth.username);
    const token = useSelector((state) => state.token.token);
    const [fullName, setFullName] = useState(globalUsername);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(clearToken());
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        navigate("/", { replace: true });
    };

    const fetchFullName = async () => {
        if (!token) {
            console.warn('No token available. Using global username.');
            setFullName(globalUsername);
            return <Navigate to={"/"} replace />;
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
        return <Navigate to={"/"} replace />
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
                        <li>
                            <Link
                                to={"/user-page/about"}
                                className={styles['header-page-link-about']}>
                                {t("header-about", { ns: "header" })}
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={styles['user-header-profile']}>
                    <p>{window.innerWidth < 1000 ? null : fullName}</p>
                    <Link
                        to={'/user-page/settings'}>
                        <AccountCircleIcon
                            style={{
                                color: 'rgb(24, 38, 98)',
                                fontSize: 40,
                                cursor: 'pointer',
                            }}
                        />
                    </Link>
                </div>
            </nav>
        </header>
    );
}