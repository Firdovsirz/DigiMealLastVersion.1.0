import React from 'react';
import styles from "../Login/Login.module.scss";
import SchoolIcon from '@mui/icons-material/School';
import AztuLogo from "../../assets/LoginPage/aztu-logo.png";
import CopyRight from '../../components/CopyRight/CopyRight';
import AztuLogoLight from "../../assets/LoginPage/aztu-logo-light.png";
import ThikLogoLight from "../../assets/LoginPage/thik-logo-light.png";

export default function Login() {
    return (
        <main className={styles['login-main']}>
            <section className={styles['login-section']}>
                <div className={styles['login-page-txt']}>
                    <div className={styles['login-page-txt-logos']}>
                        <img src={AztuLogoLight} alt="aztu-logo" />
                        <img src={ThikLogoLight} alt="thik-logo" />
                    </div>
                    <p className={styles['login-info-txt']}>DigiMeal vasitəsilə QR-kod yaradaraq pulsuz yemək əldə etmək şansından istifadə edə bilərsiz!</p>
                    <CopyRight />
                </div>
                <div className={styles['login-form-container']}>
                    <div className={styles['login-form-txt']}>
                        <SchoolIcon style={{ marginRight: 20, fontSize: 40, color: "rgb(24, 38, 98)" }} />
                        <h1>DigiMeal</h1>
                    </div>
                    <form action="">
                        <label htmlFor="fin-code" className={styles['login-form-fin-label']}>
                            <input type="text" required />
                            <div className={styles['fin-code-placeholder']}>Fin code</div>
                        </label>
                        <label htmlFor="password" className={styles['login-form-pass-label']}>
                            <input type="password" required />
                            <div className={styles['password-placeholder']}>Password</div>
                        </label>
                        <button>Log In</button>
                    </form>
                    <p>Sifreni unutdun?</p>
                </div>
            </section>
        </main>
    )
}
