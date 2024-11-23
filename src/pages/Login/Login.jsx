import AOS from 'aos';
import 'aos/dist/aos.css';
import styles from "../Login/Login.module.scss";
import React, { useState, useEffect } from 'react';
import SchoolIcon from '@mui/icons-material/School';
import AztuLogo from "../../assets/LoginPage/aztu-logo.png";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CopyRight from '../../components/CopyRight/CopyRight';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FinCodeHelp from "../../assets/LoginPage/card-id-fin.png";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AztuLogoLight from "../../assets/LoginPage/aztu-logo-light.png";
import ThikLogoLight from "../../assets/LoginPage/thik-logo-light.png";

export default function Login() {
    const [value, setValue] = useState("");
    const [finHelp, setFinHelp] = useState(false);
    const [visibility, setVisibility] = useState(false);
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
    useEffect(() => {
        const closeFinHelp = (e) => {
            if (finHelp && !e.target.closest(`.${styles['login-form-fin-label']}`)) {
                setFinHelp(false);
            }
        };

        document.addEventListener("mousedown", closeFinHelp);

        return () => {
            document.removeEventListener("mousedown", closeFinHelp);
        };
    }, [finHelp]);
    const handleVisibility = () => {
        setVisibility(!visibility);
    }
    const handleUpperCase = (e) => {
        setValue(e.target.value.toUpperCase());
    }
    return (
        <main className={styles['login-main']}>
            <section className={styles['login-section']}>
                <div className={styles['login-page-txt']}>
                    <div className={styles['login-page-txt-logos']}>
                        <img data-aos="fade-right" src={AztuLogoLight} alt="aztu-logo" />
                        <img data-aos="fade-left" src={ThikLogoLight} alt="thik-logo" />
                    </div>
                    <p
                        data-aos="fade-down"
                        className={styles['login-info-txt']}>
                        DigiMeal vasitəsilə QR-kod yaradaraq pulsuz
                        yemək əldə etmək şansından istifadə edə bilərsiz!
                    </p>
                    <CopyRight />
                </div>
                <div className={styles['login-form-container']}>
                    <div data-aos="fade-down" className={styles['login-form-txt']}>
                        <SchoolIcon style={{ marginRight: 20, fontSize: 40, color: "rgb(24, 38, 98)" }} />
                        <h1 >DigiMeal</h1>
                    </div>
                    <form action="" data-aos="fade-up">
                        <label htmlFor="fin-code" className={styles['login-form-fin-label']}>
                            <input
                                type="text"
                                value={value}
                                required
                                onChange={handleUpperCase} />
                            <div className={styles['fin-code-placeholder']}>Fin code</div>
                            <HelpOutlineIcon style={{ cursor: "pointer" }} onClick={handleFinHelpToggle} />
                            {finHelp ? <img src={FinCodeHelp} alt="fin-code-help" /> : null}
                        </label>
                        <label htmlFor="password" className={styles['login-form-pass-label']}>
                            <input
                                type={visibility ? "text" : "password"}
                                required />
                            <div className={styles['password-placeholder']}>Password</div>
                            {visibility ?
                                <VisibilityIcon
                                    style={{ color: "rgb(24, 38, 98)", cursor: "pointer" }}
                                    onClick={handleVisibility} /> :
                                <VisibilityOffIcon
                                    style={{ color: "rgb(24, 38, 98)", cursor: "pointer" }}
                                    onClick={handleVisibility} />}
                        </label>
                        <button>Log In</button>
                    </form>
                    <p data-aos="zoom-in">Sifreni unutdun?</p>
                </div>
            </section>
        </main>
    )
}
