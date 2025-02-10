import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import apiClient from '../../../../redux/apiClient';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { clearAdminAuth } from "../../../../redux/adminAuthSlice";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import styles from "../FacultyAdminAside/FacultyAdminAside.module.scss";

export default function FacultyAdmin({ facultyName }) {
  const [openedBurger, setOpenedBurger] = useState(true);
  const [faculty, setFaculty] = useState('');
  const facAdminToken = useSelector((state) => state.adminAuth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleBurgerMenu = () => {
    setOpenedBurger(!openedBurger);
  };
  const handleLogout = () => {
    dispatch(clearAdminAuth());
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("username");
    navigate("/admin-login", { replace: true });
  };
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!facAdminToken) {
        navigate("/admin-login", { replace: true });
        return;
      }
      const decodedToken = JSON.parse(atob(facAdminToken.split('.')[1]));
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();
      if (currentTime >= expirationTime) {
        localStorage.removeItem("adminAuth");
        navigate("/admin-login", { replace: true });
      }
    };
    checkTokenExpiration();
  })

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
          <Link to={'/fac-adm-reg'}>
            <li className={styles['fac-adm-register-page-route']}>
              <AppRegistrationIcon
                className={styles['fac-adm-page-icon']} />
              Qeydiyyat
            </li>
          </Link>
          <Link
            to={'/fac-adm-not-approved'}>
            <li className={styles['fac-adm-register-page-route']}>
              <HourglassBottomIcon
                className={styles['fac-adm-page-icon']} />
              Təsdiq gözləyən istifadəçilər
            </li>
          </Link>

          <Link to={'/fac-adm-approved'}>
            <li className={styles['fac-adm-register-page-route']}>
              <VerifiedUserIcon
                className={styles['fac-adm-page-icon']} />
              Təsdiqlənmiş istifadəçilər
            </li></Link>
        </ul>
      </div>
      <div className={styles['fac-adm-log-out-container']} onClick={handleLogout}>
        <LogoutIcon style={{ marginRight: 20, fontSize: 30 }} />
        Çıxış edin
      </div>
    </aside>
  );
}