import React, { useState } from 'react';
import LinkIcon from '@mui/icons-material/Link';
import HomeIcon from '@mui/icons-material/Home';
import ClassIcon from '@mui/icons-material/Class';
import styles from "./SuperAdminAside.module.scss";
import AssessmentIcon from '@mui/icons-material/Assessment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function SuperAdminAside() {
    const [openedBurger, setOpenedBurger] = useState(false);
    const [pagesDropdown, setPagesDropdown] = useState(false);
    const [factDropdown, setFactDropdown] = useState(false);
    const handleBurgerMenu = () => {
        setOpenedBurger(!openedBurger);
    }
    const toggleDropdown = () => {
        setPagesDropdown(!pagesDropdown);
    }
    const toggleFactDropdown = () => {
        setFactDropdown(!factDropdown);
    }
    return (
        <aside className={styles['super-admin-aside']} style={openedBurger ? { marginLeft: "-225px" } : { marginLeft: 0 }}>
            <div className={styles['super-admin-aside-head']}>
                <h1 className={styles['sp-adm-head-txt']}>Super Admin</h1>
                <div className={styles['super-admin-burger-icon']} onClick={handleBurgerMenu}>
                    <div className={styles['sp-admin-burger-first-ln']} />
                    <div className={styles['sp-admin-burger-second-ln']} />
                    <div className={styles['sp-admin-burger-third-ln']} />
                </div>
            </div>
            <div className={styles['super-admin-profile-info']}>
                <AccountCircleIcon className={styles['sp-adm-profile-icon']} />
                <h3 className={styles['sp-adm-profile-name']}>{'Super Admin'}</h3>
            </div>
            <div className={styles['super-admin-pages']}>
                <div className={styles['sp-adm-dashboard-nav-link-container']}>
                    <HomeIcon className={styles['sp-adm-home-icon']} />
                    Əsas
                </div>
                <div className={styles['sp-adm-anchors']}
                    style={
                        pagesDropdown ? { maxHeight: 300, transition: "all 400ms" } : { maxHeight: 40, transition: "all 400ms" }
                    }>
                    <div className={styles['sp-adm-link-anchor']}>
                        <div className={styles['sp-adm-anchor-container']}>
                            <LinkIcon className={styles['sp-adm-link-icon']} />
                            Keçidlər
                        </div>
                        <ArrowDropDownIcon
                            onClick={toggleDropdown}
                            style={pagesDropdown ? {
                                color: "rgb(109, 197, 168)",
                                cursor: 'pointer',
                                transition: 'all 400ms',
                                rotate: "180deg"
                            } : {
                                color: "rgb(109, 197, 168)",
                                cursor: 'pointer',
                                transition: 'all 400ms'
                            }} />
                    </div>
                    <ul
                        className={styles[`sp-adm-link-container`]}
                        style={pagesDropdown ? {
                            minHeight: 300,
                            visibility: 'visible',
                            opacity: 1,
                            minHeight: 300
                        } : {
                            minHeight: 0,
                            minHeight: 0,
                            opacity: 0,
                            visibility: 'hidden'
                        }}>
                        <li className={styles['sp-adm-app-wait-link-container']}>
                            <HourglassBottomIcon className={styles['sp-adm-link-icon']} />
                            Təsdiq gözləyən istifadəçilər
                        </li>
                        <li className={styles['sp-adm-approve-link-container']}>
                            <VerifiedUserIcon className={styles['sp-adm-link-icon']} />
                            Təsdiqlənmiş istifadəçilər
                        </li>
                        {/* <li className={styles['sp-adm-fact-link-container']}>
                            <ClassIcon className={styles['sp-adm-link-icon']} />
                            Fakültələr
                        </li> */}
                        <li className={styles['sp-adm-balance-link-container']}>
                            <AccountBalanceWalletIcon className={styles['sp-adm-link-icon']} />
                            Balans
                        </li>
                        <li className={styles['sp-adm-app-wait-container']}>
                            <AssessmentIcon className={styles['sp-adm-link-icon']} />
                            Hesabat
                        </li>
                    </ul>
                </div>
                <div className={styles['sp-adm-fact-link-cotainer']}>
                    <div className={styles['sp-adm-fact-container']} onClick={toggleFactDropdown}>
                        <div className={styles['sp-adm-fact-head-txt-container']}>
                            <ClassIcon className={styles['sp-adm-link-icon']} />
                            Fakültələr
                        </div>
                        <ArrowDropDownIcon style={factDropdown ? {
                            color: "rgb(109, 197, 168)",
                            cursor: 'pointer',
                            transition: 'all 400ms',
                            rotate: "180deg"
                        } : {
                            color: "rgb(109, 197, 168)",
                            cursor: 'pointer',
                            transition: 'all 400ms'
                        }} />
                    </div>
                    <ul className={styles['sp-adm-fac-list-container']}
                        style={factDropdown ? {
                            minHeight: 300,
                            visibility: 'visible',
                            opacity: 1,
                            minHeight: 300, 
                            transition: "all 400ms"
                        } : {
                            minHeight: 0,
                            minHeight: 0,
                            opacity: 0,
                            visibility: 'hidden',
                            transition: "all 400ms"
                        }}
                    >
                        <li>
                            Nəqliyyat və logistika fakültəsi
                        </li>
                        <li>
                            Energetika və avtomatika fakültəsi
                        </li>
                        <li>
                            Metallurgiya və materialşunaslıq fakültəsi
                        </li>
                        <li>
                            Maşınqayırma və robototexnika fakültəsi
                        </li>
                        <li>
                            İnformasiya və telekommunikasiya texnologiyalar fakültəsi

                        </li>
                        <li>
                            Xüsusi texnika və texnologiyaları fakültəsi
                        </li>
                        <li>
                            Alman mühəndislik fakültəsi
                        </li>
                        <li>
                            İqtisadiyyat və idarəetmə fakültəsi
                        </li>
                        <li>
                            Sabah
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    )
}
