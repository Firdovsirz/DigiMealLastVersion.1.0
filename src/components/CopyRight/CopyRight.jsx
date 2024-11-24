import AOS from 'aos';
import 'aos/dist/aos.css';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from "../CopyRight/CopyRight.module.scss";
import CopyrightIcon from '@mui/icons-material/Copyright';

export default function CopyRight({ color, marginTop, display, width }) {
    const { t } = useTranslation();
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease',
            once: true,
        });
    }, []);
    return (
        <p data-aos="fade-up"
            className={styles['copyright-txt']}
            style={{
                color: `${color}`,
                marginTop: `${marginTop}px`,
                display: `${display}`,
                width: `${width}`
            }}>
            <CopyrightIcon style={{ color: "#fff", marginRight: 10, color: `${color}` }} />
            {t('login-copyright', { ns: 'login' })}. AzTu | THİK
        </p>
    )
}
