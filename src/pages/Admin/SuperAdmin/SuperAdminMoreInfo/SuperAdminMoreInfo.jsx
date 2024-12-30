import React, { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import styles from "./SuperAdminMoreInfo.module.scss";

export default function SuperAdminMoreInfo({setMoreInfo}) {
  const handleDetailClose = () => setMoreInfo(false); 
  const currentUser = [
    {
      name: "Firdovsi",
      surname: "Rzaev",
      fatherName: "Rustem",
      faculty: "ITT",
      academicYear: 2,
      approveDate: "2024-01-15",
    }
  ];
  return (
    <div className={styles['super-admin-more-info-main-container']}>
      <ClearIcon className={styles['sp-adm-more-info-close-icon']} onClick={handleDetailClose}/>
      <div className={styles['super-admin-more-info-container']}>
        <h3>Əlavə Məlumat</h3>
        {currentUser.map((item, index) => {
          return (
            <ul key={index} className={styles['sp-adm-detailed-info-list']}>
              <li>Ad: <span>{item.name}</span></li>
              <li>Soyad: <span>{item.surname}</span></li>
              <li>Ata Adı: <span>{item.fatherName}</span></li>
              <li>Fakültə: <span>{item.faculty}</span></li>
              <li>Kurs: <span>{item.academicYear}</span></li>
              <li>Qeydiyyat Tarixi: <span>{item.approveDate}</span></li>
            </ul>
          )
        })}
      </div>
    </div>
  )
}
