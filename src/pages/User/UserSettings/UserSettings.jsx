import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./UserSettings.module.scss";
import apiClient from "../../../redux/apiClient";
import React, { useState, useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { clearToken } from "../../../redux/tokenSlice";
import Header from "../../../components/Header/Header";
import CopyRight from "../../../components/CopyRight/CopyRight";
import BottomNavigation from '../../../components/BottomNavigation/BottomNavigation';

export default function UserSettings() {
    const globalUsername = useSelector((state) => state.auth.username);
    const token = useSelector((state) => state.token.token);
    const [fullName, setFullName] = useState(globalUsername);
    const [status, setStatus] = useState('');
    const [fakulte, setFakulte] = useState(''); // For faculty data (if needed)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    console.log(globalUsername);
    
    useEffect(() => {
        // Update window width on resize
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLogout = () => {
        dispatch(clearToken());
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        navigate("/", { replace: true });
    };

    const fetchUserSettings = async () => {
        if (!token) {
            console.warn('No token available. Redirecting to login.');
            navigate("/login");  // Redirect to login if token is not available
            return;
        }

        try {
            const response = await apiClient.get('/user/settings/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data) {
                setFullName(response.data.ad + ' ' + response.data.soyad);
                setStatus(response.data.status); // Assuming 'status' is the user status
                setFakulte('ITT');  // Set faculty if you have this info (modify as needed)
            } else {
                console.warn('Failed to fetch user settings.');
            }
        } catch (error) {
            console.error('Error fetching user settings:', error);
        }
    };

    useEffect(() => {
        const checkTokenExpiration = () => {
            if (!token) {
                navigate("/", { replace: true });
                return;
            }
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = decodedToken.exp * 1000;
            const currentTime = Date.now();
            if (currentTime >= expirationTime) {
                localStorage.removeItem("authToken");
                navigate("/", { replace: true });
            }
        };
        checkTokenExpiration();
        fetchUserSettings();
    }, [globalUsername, token]);

    const name = fullName.split(' ')[0];
    const surname = fullName.split(' ')[1];

    return (
        <>
            <Header />
            <motion.main
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3 }}
                className={styles['user-settings-main']}>
                <motion.section
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.3 }}
                    className={styles['user-settings-info']}>
                    <p>İstifadəçi adı: <span>{globalUsername}</span></p>
                    <p>Ad: <span>{name}</span></p>
                    <p>Soyad: <span>{surname}</span></p>
                    <p>Status: <span>{status}</span></p>
                    <p>Fakulte: <span>{fakulte}</span></p>
                </motion.section>
                <section className={styles['user-settings-log-out']}>
                    <LogoutIcon className={styles['user-settings-log-out-icon']} onClick={handleLogout} />
                    <p>Log Out</p>
                </section>
            </motion.main>
            {windowWidth < 600 ? <BottomNavigation isButtonDisabled={true} /> : null}
        </>
    );
}
