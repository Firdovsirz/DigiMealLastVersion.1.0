import React from 'react';
import { useTranslation } from 'react-i18next';
import ErrorIcon from '@mui/icons-material/Error';
import styles from "../LoginError/LoginError.module.scss";

export default function LoginError({ errorContainer, toggleErrorContainer }) {
    const { t } = useTranslation();
    return (
        <>
            {errorContainer ? (
                <div className={styles['login-error-main']}>
                    <div className={styles['login-error-container']}>
                        <ErrorIcon className={styles['login-error-icon']} />
                        <h2>{t('login-error-head-txt', { ns: 'login' })}</h2>
                        <p>{t('login-error-desc-txt', { ns: 'login' })}</p>
                        <button
                            className={styles['login-error-re-try']}
                            onClick={toggleErrorContainer}>{t('login-error-btn-txt', { ns: 'login' })}</button>
                    </div>
                </div>
            ) : null}
        </>
    )
}
