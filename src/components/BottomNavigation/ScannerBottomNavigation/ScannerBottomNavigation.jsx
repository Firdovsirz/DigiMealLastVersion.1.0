import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import styles from "./ScannerBottomNavigation.module.scss";
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function ScannerBottomNavigation() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className={styles['scanner-bottom-nav']}>
            <div className={styles['scanner-bottom-nav-container']}>
                <div className={styles['sc-btm-nav-home']}>
                    <Link to={'/scanner-home'}>
                    <HomeIcon className={styles['sc-btm-nav-icon']}
                        style={location.pathname === '/scanner-home' ? 
                        { color: 'rgb(24, 38, 98)' } : null} /></Link>
                </div>
                <div className={styles['sc-btm-nav-history']}>
                    <Link to={'/scanner-history'}>
                        <HistoryIcon className={styles['sc-btm-nav-icon']}
                            style={location.pathname === '/scanner-history' ?
                                { color: 'rgb(24, 38, 98)' } : null} /></Link>
                </div>
                <div className={styles['sc-btm-nav-log-out']}>
                    <LogoutIcon className={styles['sc-btm-nav-icon']} />
                </div>
            </div>
        </div>
    )
}
