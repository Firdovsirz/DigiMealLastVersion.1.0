import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import React, { useState, useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { NavLink, useLocation } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from "../BottomNavigation/BottomNavigation.module.scss";

export default function BottomNavigation({ handleGenerateQr, isButtonDisabled }) {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState('');

    useEffect(() => {
        if (location.pathname === '/user-page') {
            setActiveLink('user/home');
        } else if (location.pathname === '/user-page/history') {
            setActiveLink('user/history');
        } else if (location.pathname === '/user-page/settings') {
            setActiveLink('/user/settings');
        } else if (location.pathname === '/user-page/about') {
            setActiveLink('/user/about');
        }
    })
    return (
        <div className={styles['bottom-navigation-container']}>
            <div className={styles['bottom-navigation-main']}>
                <div className={styles['bottom-nav-home']}>
                    <NavLink
                        to={"/user-page"}
                        className={styles[`${activeLink === 'user/home' ?
                            'home-active' :
                            'home-link'}`]}>
                        <HomeIcon className={styles['bottom-nav-home-icon']} />
                    </NavLink>
                </div>
                <div className={styles['bottom-nav-history']}>
                    <NavLink
                        to={"/user-page/history"}
                        className={styles[`${activeLink === 'user/history' ? 'history-active' : 'history-link'}`]}>
                        <HistoryIcon className={styles['bottom-nav-history-icon']} />
                    </NavLink>
                </div>
                <div className={styles['bottom-nav-qr']} onClick={handleGenerateQr}>
                    <QrCode2Icon className={styles['bottom-nav-qr-icon']} style={isButtonDisabled ? { color: "rgb(24, 38, 98)" } : null} />
                    {isButtonDisabled ? null : <div className={styles['bottom-nav-qr-pop-up']}>
                        <p>Click for generating qr code for today</p>
                    </div>}
                </div>
                <div className={styles['bottom-nav-about']}>
                    <NavLink
                        to={'/user-page/about'}
                        className={styles[`${activeLink === '/user/about' ? 'about-active' : 'about-link'}`]}>
                        <InfoIcon className={styles['bottom-nav-about-icon']} />
                    </NavLink>
                </div>
                <div className={styles['bottom-nav-settings']}>
                    <NavLink
                        to={"/user-page/settings"}
                        className={styles[`${activeLink === '/user/settings' ? 'settings-active' : 'settings-link'}`]}>
                        <SettingsIcon className={styles['bottom-nav-settings-icon']} />
                    </NavLink>
                </div>
            </div>
        </div>
    )
}
