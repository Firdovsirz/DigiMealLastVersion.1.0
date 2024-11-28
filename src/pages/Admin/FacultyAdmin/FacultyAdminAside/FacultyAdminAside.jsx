import React, { useState } from 'react';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import styles from "../FacultyAdminAside/FacultyAdminAside.module.scss";

export default function FacultyAdmin() {
    const [openedBurger, setOpenedBurger] = useState(true);
    const handleBurgerMenu = () => {
        setOpenedBurger(!openedBurger);
    }
    return (
        <aside
            className={styles['faculty-admin-aside']}
            style={openedBurger ? { marginLeft: 0 } : { marginLeft: '-230px' }}>
            <div className={styles['faculty-admin-aside-heading']} >
                <h2>Fakültə Admini</h2>
                <div
                    className={styles['faculty-admin-aside-burger-menu-icon-container']}
                    onClick={handleBurgerMenu}>
                    <div
                        className={openedBurger ?
                            styles['fac-adm-burger-menu-first-line'] :
                            styles['fac-adm-burger-menu-first-line-closed']} />
                    <div
                        className={openedBurger ?
                            styles['fac-adm-burger-menu-second-line'] :
                            styles['fac-adm-burger-menu-second-line-closed']
                        } />
                    <div className={openedBurger ?
                        styles['fac-adm-burger-menu-third-line'] :
                        styles['fac-adm-burger-menu-third-line-closed']
                    } />
                </div>
            </div>
            <div className={styles['fac-adm-pages']}>
                <ul>
                    <li className={styles['fac-adm-register-page-route']}>
                        <AppRegistrationIcon style={{ color: 'rgb(24, 38, 98)', marginRight: '20px' }} />
                        Qeydiyyat
                    </li>
                    <li className={styles['fac-adm-register-page-route']}>
                        <HourglassBottomIcon style={{ color: 'rgb(24, 38, 98)', marginRight: '20px' }} />
                        Təsdiq gözləyən istifadəçilər
                    </li>
                    <li className={styles['fac-adm-register-page-route']}>
                        <VerifiedUserIcon style={{ color: 'rgb(24, 38, 98)', marginRight: '20px' }} />
                        Təsdiqlənmiş istifadəçilər
                    </li>
                </ul>
            </div>
        </aside>
    )
}
