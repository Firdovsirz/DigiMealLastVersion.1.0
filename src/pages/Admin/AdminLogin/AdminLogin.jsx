import React from 'react';
import styles from "./AdminLogin.module.scss";
import SchoolIcon from '@mui/icons-material/School';

export default function AdminLogin() {
    return (
        <main className={styles['admin-login-main']}>
            <div className={styles['admin-login-main-container']}>
                <div className={styles['admin-login-text']}>
                    <h2>Admin</h2>
                    <div className={styles['admin-login-text-logo']}>
                        <SchoolIcon style={{
                            color: 'rgb(109, 197, 168)',
                            fontSize: 40, 
                            marginRight: 10
                        }} />
                        <h3>DigiMeal</h3>
                    </div>
                </div>
                <form action="" className={styles['admin-login-form']}>
                    <div className={styles['admin-login-username-container']}>
                        <input type="text" required/>
                        <div className={styles['admin-login-username-placeholder']}>
                            İstifadəçi adı
                        </div>
                    </div>
                    <div className={styles['admin-login-password-container']}>
                        <input type="password" required/>
                        <div className={styles['admin-login-password-placeholder']}>
                            Şifrə
                        </div>
                    </div>
                    <button className={styles['admin-login-submit-btn']}>Daxil Ol</button>
                </form>
            </div>
        </main>
    )
}
