import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import styles from "./SuperAdminAdditionalInfo.module.scss";

export default function SuperAdminAdditionalInfo({
    additionalInfo,
    setAdditionalInfo,
    object
}) {
    const handleClose = () => {
        setAdditionalInfo(false)
    }
    console.log(object);
    
    return (
        <>
            {additionalInfo ? (
                <main className={styles['admin-additional-info-main']}>
                    <div className={styles['admin-additonal-info-container']}>
                        <CloseIcon className={styles['adm-add-close-icon']} onClick={handleClose} />
                        <h2>Əlavə məlumat</h2>
                        <div className={styles['admin-additonal-info-list']}>
                            <ul>
                                <li><span>Ad:</span> {object.ad} </li>
                                <li><span>Soyad:</span> {object.soyad} </li>
                                <li><span>Ata adı:</span> {object.ata_adi} </li>
                                <li><span>Fakültə:</span> {object.fakulte} </li>
                                <li><span>Fin kod:</span> {object.fin_kod} </li>
                                <li><span>Qrup:</span> {object.qrup_no} </li>
                                <li><span>Status:</span> {object.status} </li>
                                <li><span>Telefon nömrəsi:</span> {object.phonenumber} </li>
                            </ul>
                        </div>
                        <div>
                            {JSON.stringify(object.sessiya).replace(/[{}\"\\]/g, '').trim()}
                        </div>
                    </div>
                </ main>
            ) : null}
        </>
    )
}
