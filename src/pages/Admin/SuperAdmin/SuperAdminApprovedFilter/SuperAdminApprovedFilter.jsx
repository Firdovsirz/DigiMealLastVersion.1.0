import React, { useState } from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import styles from "./SuperAdminApprovedFilter.module.scss";

export default function SuperAdminApprovedFilter({handleApprovedOpen, approvedFilter, setApprovedFilter, approvedFaculty, setApprovedFaculty}) {
    const handleApprovedFaculty = (e) => {
        setApprovedFaculty(e.target.value)
        handleApprovedOpen()
    }
    
    return (
        <div className={styles['sp-adm-wt-app-filter-container']}>
            <div className={styles['sp-adm-wt-app-filter-icon-container']} onClick={handleApprovedOpen}>
                <TuneIcon className={styles['sp-adm-wt-app-filter-icon']}/>
            </div>
            {approvedFilter ? (
                <div className={styles['sp-adm-wt-app-fiter-form-container']}>
                    <form action="">
                        <div>
                            <p>Fakültə</p>
                            <select name="faculty" id="faculty" value={approvedFaculty} onChange={handleApprovedFaculty}>
                                <option value="">Fakültə</option>
                                <option value="ITT">ITT</option>
                                <option value="Neqliyyat">Nəqliyyat və logistika fakültəsi</option>
                                <option value="Energetika">Energetika və avtomatika fakültəsi</option>
                                <option value="Metallurgiya">Metallurgiya və materialşunaslıq fakültəsi</option>
                                <option value="XTT">Xüsusi texnika və texnologiyaları fakültəsi</option>
                                <option value="Alman">Alman mühəndislik fakültəsi</option>
                                <option value="Iqtisadiyyat">İqtisadiyyat və idarəetmə fakültəsi</option>
                                <option value="Masinqayirma">Masinqayirma və robotexnika</option>
                                <option value="Sabah">Sabah</option>
                            </select>
                        </div>
                        <button>Filter</button>
                    </form>
                </div>
            ) : null}
        </div>
    )
}
