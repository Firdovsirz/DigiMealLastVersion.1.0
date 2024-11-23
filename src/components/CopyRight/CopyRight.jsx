import AOS from 'aos';
import 'aos/dist/aos.css';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from "../CopyRight/CopyRight.module.scss";
import CopyrightIcon from '@mui/icons-material/Copyright';

export default function CopyRight() {
    const { t } = useTranslation();
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease',
            once: true,
        });
    }, []);
    return (
        <p data-aos="fade-up" className={styles['copyright-txt']}>
            <CopyrightIcon style={{ color: "#fff", marginRight: 10 }} />
            {t('login-copyright', { ns: 'login' })}. AzTu | THİK
        </p>
    )
}
