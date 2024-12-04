import React from 'react';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import styles from "../BottomNavigation/BottomNavigation.module.scss";

export default function BottomNavigation() {
    return (
        <div className={styles['bottom-navigation']}>
            <div className={styles['bottm-nav-container']}>
                <div className={styles['bottom-nav-btn-container']}>
                        <div className={styles['bottom-nav-curve-first']} />
                                <div className={styles['bottom-nav-curve-second']} />
                    <div className={styles['bottom-nav-btn-styling']}>
                        <div className={styles['bottom-nav-btn-icon-container']}>
                            <div className={styles['bottom-nav-btn-icon-container']}>
                                <QrCode2Icon
                                    style={{
                                        color: 'rgb(24, 38, 98',
                                        fontSize: 35
                                    }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
