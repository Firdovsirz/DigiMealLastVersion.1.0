import React from 'react';
import styles from "../Header/Header.module.scss";
import SchoolIcon from '@mui/icons-material/School';

export default function Header() {
    return (
        <header>
            <nav>
                <div className={styles['header-logo']}>
                    <SchoolIcon />
                    <h1>DigiMeal</h1>
                </div>
                <div className={styles['header-pages']}>
                    <ul>
                        <li>Qr Code Generate</li>
                        <li>History</li>
                    </ul>
                </div>
                <div></div>
            </nav>
        </header>
    )
}
