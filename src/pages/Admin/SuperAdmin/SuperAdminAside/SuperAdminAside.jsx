import { Link } from "react-router-dom";
import React, { useState, useRef } from 'react';
import LinkIcon from '@mui/icons-material/Link';
import HomeIcon from '@mui/icons-material/Home';
import ClassIcon from '@mui/icons-material/Class';
import styles from "./SuperAdminAside.module.scss";
import AssessmentIcon from '@mui/icons-material/Assessment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function SuperAdminAside({setFaculty}) {
    const [openedBurger, setOpenedBurger] = useState(false);
    const [pagesDropdown, setPagesDropdown] = useState(false);
    const [factDropdown, setFactDropdown] = useState(false);
    const dropdown1Ref = useRef(null);
    const dropdown2Ref = useRef(null);
    const dropdown3Ref = useRef(null);
    const dropdown4Ref = useRef(null);
    const dropdown5Ref = useRef(null);
    const dropdown6Ref = useRef(null);
    const dropdown7Ref = useRef(null);
    const dropdown8Ref = useRef(null);
    const dropdown9Ref = useRef(null);
    const faculties = [
        'Nəqliyyat və logistika fakültəsi',
        'Energetika və avtomatika fakültəsi',
        'Metallurgiya və materialşunaslıq fakültəsi',
        'İnformasiya və telekommunikasiya texnologiyalar fakültəsi',
        'Xüsusi texnika və texnologiyaları fakültəsi',
        'Alman mühəndislik fakültəsi',
        'İqtisadiyyat və idarəetmə fakültəsi',
        'Masinqayirma və robotexnika',
        'Sabah',
    ];

    // to handle the faculty change in super admin
    const handleFaculty = (fac) => {
        switch (fac) {
            case 'Nəqliyyat və logistika fakültəsi':
                setFaculty('Neqliyyat');
                console.log("neqliyyat clicked");
                
                break;
            case 'Energetika və avtomatika fakültəsi' :
                setFaculty('Energetika');
                break;
            case 'Metallurgiya və materialşunaslıq fakültəsi' :
                setFaculty('Metallurgiya');
                break;
            case 'İnformasiya və telekommunikasiya texnologiyalar fakültəsi': 
                setFaculty('ITT');
                break;
            case 'Xüsusi texnika və texnologiyaları fakültəsi':
                setFaculty('XTT');
                break;
            case 'Alman mühəndislik fakültəsi':
                setFaculty('Alman');
                break;
            case 'İqtisadiyyat və idarəetmə fakültəsi':
                setFaculty('Iqtisadiyyat');
                break;
            case 'Masinqayirma və robotexnika':
                setFaculty('Masinqayirma');
                break;
            case 'Sabah':
                setFaculty('Sabah');
        }
    }

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
        <aside className={styles['super-admin-aside']} style={openedBurger ? { marginLeft: "-300px" } : { marginLeft: 0 }}>
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
                <Link to={'/super-admin-home'}>
                    <div className={styles['sp-adm-dashboard-nav-link-container']}>
                        <HomeIcon className={styles['sp-adm-home-icon']} />
                        Əsas
                    </div>
                </Link>
                <div className={styles['sp-adm-anchors']}
                    style={
                        pagesDropdown ? { maxHeight: 'fit-content', transition: "all 400ms" } : { maxHeight: 40, transition: "all 400ms" }
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
                            opacity: 0,
                            visibility: 'hidden'
                        }}>
                        <Link to={'/super-admin-waiting-approve'}>
                            <li className={styles['sp-adm-app-wait-link-container']}>
                                <HourglassBottomIcon className={styles['sp-adm-link-icon']} />
                                Təsdiq gözləyən istifadəçilər
                            </li>
                        </Link>
                        <Link to={'/super-admin-approved'}>
                            <li className={styles['sp-adm-approve-link-container']}>
                                <VerifiedUserIcon className={styles['sp-adm-link-icon']} />
                                Təsdiqlənmiş istifadəçilər
                            </li>
                        </Link>
                        <Link to={'/super-admin-session-ended'}>
                            <li className={styles['sp-adm-approve-link-container']}>
                                <RestoreFromTrashIcon className={styles['sp-adm-link-icon']} />
                                Sessiyası bitmiş istifadəçilər
                            </li>
                        </Link>
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
                            transition: 'all 400ms',
                            height: 100
                        }} />
                    </div>
                    <ul className={styles['sp-adm-fac-list-container']}
                        style={factDropdown ? {
                            minHeight: 300,
                            visibility: 'visible',
                            opacity: 1,
                            transition: "all 400ms"
                        } : {
                            minHeight: 0,
                            visibility: 'hidden',
                            opacity: 0,
                            transition: "all 400ms",
                            display: "none"
                        }}
                    >
                        {faculties.map((item) => {
                            return (
                                <li className={styles['sp-adm-fac-item-container']}>
                                    <div className={styles['sp-adm-fac-item-txt']}>
                                        {item}
                                        <ArrowDropDownIcon />
                                    </div>
                                    <div className={styles['sp-adm-fac-item-dropdown']}>
                                        <ul>
                                            <li>Təsdiq gözləyən istifadəçilər</li>
                                            <li onClick={() => handleFaculty(item)}>Təsdiqlənmiş istifadəçilər</li>
                                        </ul>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </aside>
    )
}
