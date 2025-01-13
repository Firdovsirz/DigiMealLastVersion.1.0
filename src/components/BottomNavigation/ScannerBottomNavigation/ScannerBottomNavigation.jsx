import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import styles from "./ScannerBottomNavigation.module.scss";

export default function ScannerBottomNavigation() {
  return (
    <div className={styles['scanner-bottom-nav']}>
        <div className={styles['scanner-bottom-nav-container']}>
            <div className={styles['sc-btm-nav-home']}>
                <HomeIcon className={styles['sc-btm-nav-icon']}/>
            </div>
            <div className={styles['sc-btm-nav-history']}>
                <HistoryIcon className={styles['sc-btm-nav-icon']}/>
            </div>
            <div className={styles['sc-btm-nav-log-out']}>
                <LogoutIcon className={styles['sc-btm-nav-icon']}/>
            </div>
        </div>
    </div>
  )
}
