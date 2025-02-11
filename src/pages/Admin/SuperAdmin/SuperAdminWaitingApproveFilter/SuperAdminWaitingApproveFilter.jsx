import React from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import styles from "..SuperAdminWaitingApproveFilter/SuperAdminWaitingApproveFilter.module.scss";

export default function SuperAdminWaitingApproveFilter() {
    return (
        <div className={styles['sp-adm-wt-app-filter-container']}>
            <div className={styles['sp-adm-wt-app-filter-icon']}>
                <TuneIcon />
            </div>
            <div className={styles['sp-adm-wt-app-fiter-form-container']}>
                <form action=""></form>
            </div>
        </div>
    )
}
