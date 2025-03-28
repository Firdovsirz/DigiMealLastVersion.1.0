import React, { useState } from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import styles from "./SuperAdminWaitingApproveFilter.module.scss";

export default function SuperAdminWaitingApproveFilter({handleOpen, filter, setFilter, faculty, setFaculty}) {
    const handleFaculty = (e) => {
        setFaculty(e.target.value)
        handleOpen()
    }
    console.log(faculty);
    
    return (
        <div className={styles['sp-adm-wt-app-filter-container']}>
            <div className={styles['sp-adm-wt-app-filter-icon-container']} onClick={handleOpen}>
                <TuneIcon className={styles['sp-adm-wt-app-filter-icon']}/>
            </div>
            {filter ? (
                <div className={styles['sp-adm-wt-app-fiter-form-container']}>
                    <form action="">
                        <div>
                            <p>Fakültə</p>
                            <select name="faculty" id="faculty" value={faculty} onChange={handleFaculty}>
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
