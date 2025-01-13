import React from 'react';
import { School } from '@mui/icons-material';
import styles from "./ScannerHeader.module.scss";
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ScannerHeader() {
    return (
        <header className={styles['scanner-header']}>
            <nav>
                <div className={styles['scanner-header-logo']}>
                    <SchoolIcon style={{
                        color: "rgb(24, 38, 98)",
                        fontSize: 40,
                        marginRight: 20
                    }} />
                    <h2>DigiMeal</h2>
                </div>
                <div className={styles['scanner-header-profile']}>
                    <h3>{`name of the korpus`}</h3>
                    <AccountCircleIcon style={{
                        color: "rgb(24, 38, 98)",
                        fontSize: 40
                    }} />
                </div>
            </nav>
        </header>
    )
}
