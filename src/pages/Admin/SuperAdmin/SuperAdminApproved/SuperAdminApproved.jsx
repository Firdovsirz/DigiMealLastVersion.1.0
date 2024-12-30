import React, { useState } from 'react';
import styles from "./SuperAdminApproved.module.scss";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SuperAdminAside from '../SuperAdminAside/SuperAdminAside';
import SuperAdminMoreInfo from '../SuperAdminMoreInfo/SuperAdminMoreInfo';

export default function SuperAdminApproved() {
    const [moreDetail, setMoreDetail] = useState(false);
    const handleMoreDetail = () => {
        setMoreDetail(!moreDetail);
    }
    const sampleData = [
        {
            nameSurnameFather: "Karam Shukurlu Rehim",
            faculty: "ITT",
            appDate: "2024-02-15",
            kurs: 2,
        },
        {
            nameSurnameFather: "Karam Shukurlu Rehim",
            faculty: "ITT",
            appDate: "2024-02-15",
            kurs: 2,
        },
        {
            nameSurnameFather: "Karam Shukurlu Rehim",
            faculty: "ITT",
            appDate: "2024-02-15",
            kurs: 2,
        },
        {
            nameSurnameFather: "Karam Shukurlu Rehim",
            faculty: "ITT",
            appDate: "2024-02-15",
            kurs: 2,
        },
        {
            nameSurnameFather: "Karam Shukurlu Rehim",
            faculty: "ITT",
            appDate: "2024-02-15",
            kurs: 2,
        },
        {
            nameSurnameFather: "Karam Shukurlu Rehim",
            faculty: "ITT",
            appDate: "2024-02-15",
            kurs: 2,
        }
    ];
    return (
        <>
            <main className={styles['super-admin-approved-main']}>
                <SuperAdminAside />
                <div className={styles['super-admin-approved-main-container']}>
                    <div className={styles['sp-adm-approved-head-txt']}>
                        <h1>Təsdiqlənmiş istifadəçilər</h1>
                    </div>
                    <div className={styles['sp-adm-approved-table-container']}>
                        <form action="" className={styles['sp-adm-approved-search-form']}>
                            <input type="search" required />
                            <div className={styles['sp-adm-approved-search-placeholder']}>
                                Axtarış edin...
                            </div>
                        </form>
                        <table className={styles['sp-adm-approved-table']}>
                            <thead>
                                <tr>
                                    <th>Ad, Soyad, Ata adı</th>
                                    <th>Fakültə</th>
                                    <th>Qeydiyyat tarixi</th>
                                    <th>Kurs</th>
                                    <th>Əlavə məlumat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sampleData.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.nameSurnameFather}</td>
                                            <td>{item.faculty}</td>
                                            <td>{item.appDate}</td>
                                            <td>{item.kurs}</td>
                                            <td onClick={handleMoreDetail}>
                                                <p>
                                                    <MoreHorizIcon />
                                                </p>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            {moreDetail ? <SuperAdminMoreInfo setMoreInfo={setMoreDetail}/> : null}
        </>
    )
}
