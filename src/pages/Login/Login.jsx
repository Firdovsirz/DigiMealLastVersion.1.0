import AOS from 'aos';
import 'aos/dist/aos.css';
import apiClient from '../../redux/apiClient';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from "../Login/Login.module.scss";
import LoginError from './LoginError/LoginError';
import { setToken } from '../../redux/tokenSlice';
import React, { useState, useEffect } from 'react';
import { setUsername } from '../../redux/authSlice';
import SchoolIcon from '@mui/icons-material/School';
import { useSelector, useDispatch } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CopyRight from '../../components/CopyRight/CopyRight';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FinCodeHelp from "../../assets/LoginPage/card-id-fin.png";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AztuLogoLight from "../../assets/LoginPage/aztu-logo-light.png";
import ThikLogoLight from "../../assets/LoginPage/thik-logo-light.png";
import LanguageChanger from '../../components/LanguageChanger/LanguageChanger';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [password, setPassword] = useState("");
    const [finHelp, setFinHelp] = useState(false);
    const [visibility, setVisibility] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorContainer, setErrorContainer] = useState(false);
    const username = useSelector((state) => state.auth.username);

    const handleFinHelpToggle = (e) => {
        e.stopPropagation();
        setFinHelp((prev) => !prev);
    };

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease',
            once: true,
        });
    }, []);

    const toggleErrorContainer = () => {
        setErrorContainer(!errorContainer);
    };

    const handleVisibility = () => {
        setVisibility(!visibility);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!username || !password) {
            setErrorMessage("Username and password are required");
            toggleErrorContainer();
            return;
        }

        try {
            const response = await apiClient.post('/user/login', { username, password });
            const { success, token, message } = response.data;

            if (success) {
                dispatch(setToken(token));
                dispatch(setUsername(username));
                navigate('/user-page', { state: { username } });
            } else {
                setErrorMessage(message || "Login failed");
                toggleErrorContainer();
            }
        } catch (error) {
            setErrorMessage("Network error. Please try again.");
            toggleErrorContainer();
        }
    };

    return (
        <>
            {/* <LanguageChanger /> */}
            <main className={styles['login-main']}>
                <div className={styles['test-container']}>
                    <section className={styles['login-section']}>
                        <div className={styles['login-page-txt']}>
                            <div className={styles['login-page-txt-logos']}>
                                <img data-aos="fade-right" src={AztuLogoLight} alt="aztu-logo" />
                                <img data-aos="fade-left" src={ThikLogoLight} alt="thik-logo" />
                            </div>
                            <p data-aos="fade-down" className={styles['login-info-txt']}>
                                {t("login-info-text", { ns: "login" })}
                            </p>
                            <CopyRight />
                        </div>
                        <div className={styles['login-form-container']}>
                            <div data-aos="fade-down" className={styles['login-form-txt']}>
                                <SchoolIcon style={{ marginRight: 20, fontSize: 40, color: "rgb(24, 38, 98)" }} />
                                <h1>DigiMeal</h1>
                            </div>
                            <form onSubmit={handleLogin} data-aos="fade-up">
                                <div className={styles['login-form-fin-label']}>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => dispatch(setUsername(e.target.value))}
                                        required
                                    />
                                    <div className={styles['fin-code-placeholder']}>
                                        {t("login-fin-input-placeholder", { ns: "login" })}
                                    </div>
                                    <HelpOutlineIcon style={{ cursor: "pointer" }} onClick={handleFinHelpToggle} />
                                    {/* {finHelp && <img src={FinCodeHelp} alt="fin-code-help" />} */}
                                </div>
                                <div className={styles['login-form-pass-label']}>
                                    <input
                                        type={visibility ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <div className={styles['password-placeholder']}>
                                        {t("login-pass-input-placeholder", { ns: "login" })}
                                    </div>
                                    {visibility ? (
                                        <VisibilityIcon style={{ cursor: "pointer" }} onClick={handleVisibility} />
                                    ) : (
                                        <VisibilityOffIcon style={{ cursor: "pointer" }} onClick={handleVisibility} />
                                    )}
                                </div>
                                <button type="submit">
                                    {t("login-btn-text", { ns: "login" })}
                                </button>
                            </form>
                            <p className={styles['forget-pass-txt']} data-aos="zoom-in">
                                {t("login-forget-password", { ns: "login" })}
                            </p>
                        </div>
                    </section>
                </div>
            </main>
            <LoginError
                errorContainer={errorContainer}
                toggleErrorContainer={toggleErrorContainer}
            />
            {successMessage && <div>{successMessage}</div>}
        </>
    );
}