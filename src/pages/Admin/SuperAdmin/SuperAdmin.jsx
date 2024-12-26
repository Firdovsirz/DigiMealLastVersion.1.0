import React from 'react';
import styles from "./SuperAdminAside.module.scss";
import SuperAdminAside from './SuperAdminAside/SuperAdminAside';

export default function SuperAdmin() {
    return (
        <>
            <SuperAdminAside />
            <main className={styles['super-admin-main']}>

            </main>
        </>
    )
}
