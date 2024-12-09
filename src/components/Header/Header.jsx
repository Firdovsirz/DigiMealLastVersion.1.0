import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import styles from "../Header/Header.module.scss";
import React, { useState, useEffect } from 'react';
import { setUsername } from '../../redux/authSlice';
import SchoolIcon from '@mui/icons-material/School';
import { useSelector, useDispatch } from 'react-redux';
import LanguageChanger from '../LanguageChanger/LanguageChanger';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Header() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const globalUsername = useSelector((state) => state.auth.username);
    const [fullName, setFullName] = useState(globalUsername);
    const [burgerMenu, setBurgerMenu] = useState(true);

    const handleBurgerMenu = () => {
        setBurgerMenu(!burgerMenu);
    };

    useEffect(() => {
        if (globalUsername) {
            fetchFullName(globalUsername).then((name) => setFullName(name));
        }
    }, [globalUsername]);

    if (!globalUsername) {
        return <p>Please log in to access the dashboard</p>;
    }
    const fetchFullName = async (username) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/get_username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch full name');
            }

            const result = await response.json();
            if (result.success) {
                return result.istifadeci_adi;
            } else {
                return username;
            }
        } catch (error) {
            console.error(error);
            return username;
        }
    };

    return (
        <header className={styles['user-header']}>
            <nav className={styles['user-nav']}>
                <div className={styles['header-logo']}>
                    <SchoolIcon style={{ color: 'rgb(24, 38, 98', fontSize: 35, marginRight: 15 }} />
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
                                to={'/user-history'}
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
                            color: 'rgb(24, 38, 98',
                            fontSize: 40,
                            cursor: 'pointer',
                        }} />
                    {window.innerWidth > 600 ? <LanguageChanger position={'relative'} top={0} right={0} /> : null}

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
                            <li>Qr Generate</li>
                            <li>History</li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}