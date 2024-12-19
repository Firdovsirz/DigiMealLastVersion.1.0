import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from "../BottomNavigation/BottomNavigation.module.scss";

export default function BottomNavigation() {
    return (
        <div className={styles['bottom-navigation-container']}>
            <div className={styles['bottom-navigation-main']}>
                <div className={styles['bottom-nav-home']}>
                    <HomeIcon className={styles['bottom-nav-home-icon']} />
                </div>
                <div className={styles['bottom-nav-history']}>
                    <HistoryIcon className={styles['bottom-nav-history-icon']} />
                </div>
                <div className={styles['bottom-nav-qr']}>
                    <QrCode2Icon className={styles['bottom-nav-qr-icon']} />
                </div>
                <div className={styles['bottom-nav-profile']}>
                    <AccountCircleIcon className={styles['bottom-nav-profile-icon']} />
                </div>
                <div className={styles['bottom-nav-log-out']}>
                    <LogoutIcon className={styles['bottom-nav-log-out-icon']} />
                </div>
            </div>
        </div>
    )
}
