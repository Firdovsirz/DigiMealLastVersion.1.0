import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import apiClient from '../../../../redux/apiClient'; // Use the configured axios instance
import styles from "../FacultyAdminAside/FacultyAdminAside.module.scss";

export default function FacultyAdmin() {
  const [openedBurger, setOpenedBurger] = useState(true);
  const [facultyName, setFacultyName] = useState('');
  const adminUsername = useSelector((state) => state.adminAuth.username);
  const adminToken = useSelector((state) => state.adminAuth.token);  // Get token from Redux state
  const isAdminAuthenticated = useSelector((state) => state.adminAuth.isAuthenticated);  // Check authentication status

  useEffect(() => {
    if (!isAdminAuthenticated) {
      // Handle case when admin is not authenticated (show an alert or redirect)
      console.log('Admin is not authenticated!');
      return;
    }

    const fetchFacultyName = async () => {
      try {
        const response = await apiClient.post(
          '/admin/get_admin_username',
          { usernameadmin: adminUsername },
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,  // Use token from Redux store
            },
          }
        );

        if (response.data.success) {
          setFacultyName(response.data.results[0].istifadeciadi);
        } else {
          console.error('Error fetching faculty name:', response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (adminUsername) {
      fetchFacultyName();
    }
  }, [adminUsername, adminToken, isAdminAuthenticated]);  // Add authentication check as dependency

  const handleBurgerMenu = () => {
    setOpenedBurger(!openedBurger);
  };

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
            <div className={styles['faculty-admin-profile-container']}>
                <AccountCircleIcon className={styles['fac-adm-profile-icon']} />
                <h3>{facultyName}</h3>
            </div>
            <div className={styles['fac-adm-pages']}>
                <ul>
                    <li className={styles['fac-adm-register-page-route']}>
                        <AppRegistrationIcon
                            className={styles['fac-adm-page-icon']} />
                        Qeydiyyat
                    </li>
                    <li className={styles['fac-adm-register-page-route']}>
                        <HourglassBottomIcon
                            className={styles['fac-adm-page-icon']} />
                        Təsdiq gözləyən istifadəçilər
                    </li>
                    <li className={styles['fac-adm-register-page-route']}>
                        <VerifiedUserIcon
                            className={styles['fac-adm-page-icon']} />
                        Təsdiqlənmiş istifadəçilər
                    </li>
                </ul>
            </div>
        </aside>
    );
}