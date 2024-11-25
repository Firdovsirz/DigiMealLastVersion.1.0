import React from 'react';
import styles from "../Header/Header.module.scss";
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LanguageChanger from '../LanguageChanger/LanguageChanger';

export default function Header() {
    return (
        <header className={styles['user-header']}>
            <nav className={styles['user-nav']}>
                <div className={styles['header-logo']}>
                    <SchoolIcon style={{ color: 'rgb(24, 38, 98', fontSize: 35, marginRight: 15 }} />
                    <h1>DigiMeal</h1>
                </div>
                <div className={styles['header-pages']}>
                    <ul>
                        <li>Qr Code Generate</li>
                        <li>History</li>
                    </ul>
                </div>
                <div className={styles['user-header-profile']}>
                    <p>Name Surname</p>
                    <AccountCircleIcon style={{ color: 'rgb(24, 38, 98', fontSize: 40, marginLeft: 15, cursor: 'pointer', marginRight: 30 }} />
                    <LanguageChanger position={'relative'} top={0} right={0}/>
                </div>
            </nav>
        </header>
    )
}
