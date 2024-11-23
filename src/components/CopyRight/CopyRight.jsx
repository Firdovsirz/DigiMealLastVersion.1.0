import AOS from 'aos';
import 'aos/dist/aos.css';
import React, { useEffect } from 'react';
import styles from "../CopyRight/CopyRight.module.scss";
import CopyrightIcon from '@mui/icons-material/Copyright';

export default function CopyRight() {
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
            Bütün hüquqlar qorunur. AzTu | THİK
        </p>
    )
}
