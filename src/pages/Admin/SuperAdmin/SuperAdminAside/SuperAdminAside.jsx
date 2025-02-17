import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useState, useRef } from 'react';
import LinkIcon from '@mui/icons-material/Link';
import HomeIcon from '@mui/icons-material/Home';
import ClassIcon from '@mui/icons-material/Class';
import styles from "./SuperAdminAside.module.scss";
import LogoutIcon from '@mui/icons-material/Logout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { clearSuperAdminAuth } from "../../../../redux/superAdminAuthSlice";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function SuperAdminAside({ setFaculty }) {
    const [openedBurger, setOpenedBurger] = useState(false);
    const [pagesDropdown, setPagesDropdown] = useState(true);
    const [factDropdown, setFactDropdown] = useState(false);

    const handleBurgerMenu = () => {
        setOpenedBurger(!openedBurger);
    }
    const toggleDropdown = () => {
        setPagesDropdown(!pagesDropdown);
    }
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Logout function to clear authentication and navigate to login page
    const handleLogout = () => {
        // Clear the authentication state in Redux
        dispatch(clearSuperAdminAuth());

        // Optionally, remove the token from localStorage (if you store it there)
        localStorage.removeItem('authToken'); // Optional if you store the token in localStorage

        // Navigate to the super admin login page
        navigate('/super-admin-login', { replace: true });
    };
    return (
        <aside className={styles['super-admin-aside']} style={openedBurger ? { marginLeft: "-320px" } : { marginLeft: 0 }}>
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
                        {/* <li className={styles['sp-adm-balance-link-container']}>
                            <AccountBalanceWalletIcon className={styles['sp-adm-link-icon']} />
                            Balans
                        </li> */}
                        <Link to={'/super-admin-all-users-account'}>
                            <li className={styles['sp-adm-app-wait-container']}>
                                <AssessmentIcon className={styles['sp-adm-link-icon']} />
                                İstifadəçi hesabatı
                            </li>
                        </Link>
                        <Link to={'/super-admin-account'}>
                            <li className={styles['sp-adm-app-wait-container']}>
                                <AssessmentIcon className={styles['sp-adm-link-icon']} />
                                Bufet Hesabatı
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
            <div style={{
                color: "rgb(109, 197, 168)",
                fontSize: 20,
                position: "absolute",
                bottom: 100, left: 20,
                display: "flex",
                alignItems: "center",
                cursor: "pointer"
            }}
            onClick={handleLogout}>
                <LogoutIcon style={{ color: "rgb(109, 197, 168)", fontSize: 40, marginRight: 20 }} />
                Çıxış edin
            </div>
        </aside>
    )
}
