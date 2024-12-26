import React from 'react';
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import styles from "./SuperAdminHome.module.scss";
import "react-circular-progressbar/dist/styles.css";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SuperAdminAside from "../SuperAdminAside/SuperAdminAside";

export default function SuperAdminHome() {
    return (
        <>
            <main className={styles['super-admin-home-main']}>
                <SuperAdminAside />
                <div className={styles['super-admin-home-main-container']}>
                    <div className={styles['sp-adm-home-head-txt']}>
                        <h1>Dashboard</h1>
                        <p>Admin Panelə xoş gəlmisiniz!</p>
                    </div>
                    <div className={styles['sp-adm-home-short-info-container']}>
                        <div className={styles['sp-adm-home-new-cust']}>
                            <div className={styles['sp-adm-new-cust-txt']}>
                                <PersonAddIcon className={styles['sp-adm-short-info-icon']} />
                                <p className={styles['sp-adm-short-info-amount']}>{`123`}</p>
                                <p className={styles['sp-adm-short-info-detail-txt']}>Yeni istifadəçi</p>
                            </div>
                            <div className={styles['sp-adm-new-cust-chart-container']}>
                                <div className={styles['sp-admin-short-info-chart-container']}>
                                    <CircularProgressbar
                                        value={25}
                                        text={`${25}%`}
                                        strokeWidth={5}
                                    />
                                </div>
                                <p>{`+${`25`}%`}</p>
                            </div>
                        </div>
                        <div className={styles['sp-adm-daily-usage']}>
                            <div className={styles['sp-adm-daily-usage-txt']}>
                                <AttachMoneyIcon className={styles['sp-adm-short-info-icon']} />
                                <p className={styles['sp-adm-short-info-amount']}>{`123`}</p>
                                <p className={styles['sp-adm-short-info-detail-txt']}>Günlük istifadə</p>
                            </div>
                            <div className={styles['sp-adm-daily-usage-chart-container']}>
                            <div className={styles['sp-admin-short-info-chart-container']}>
                                    <CircularProgressbar
                                        value={40}
                                        text={`${40}%`}
                                        strokeWidth={5}
                                    />
                                </div>
                                <p>{`+${`35`}%`}</p>
                            </div>
                        </div>
                        <div className={styles['sp-adm-removed-user']}>
                            <div className={styles['sp-adm-removed-user-txt']}>
                                <PersonRemoveIcon className={styles['sp-adm-short-info-icon']} />
                                <p className={styles['sp-adm-short-info-amount']}>{`123`}</p>
                                <p className={styles['sp-adm-short-info-detail-txt']}>Silinən istifadəçilər</p>
                            </div>
                            <div className={styles['sp-adm-removed-user-chart-container']}>
                            <div className={styles['sp-admin-short-info-chart-container']}>
                                    <CircularProgressbar
                                        value={60}
                                        text={`${60}%`}
                                        strokeWidth={5}
                                    />
                                </div>
                                <p>{`+${`35`}%`}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles['sp-adm-home-graph']}>
                        
                    </div>
                </div>
            </main>
        </>
    )
}
