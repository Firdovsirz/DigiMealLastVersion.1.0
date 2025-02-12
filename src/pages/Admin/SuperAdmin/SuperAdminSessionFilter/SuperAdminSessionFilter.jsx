import React, { useState } from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import styles from "./SuperAdminSessionFilter.module.scss";

export default function SuperAdminSessionFilter({handleSessionOpen, sessionFilter, setSessionFilter, sessionFaculty, setSessionFaculty}) {
    const handleSessionFaculty = (e) => {
        setSessionFaculty(e.target.value)
        handleSessionOpen()
    }
    
    return (
        <div className={styles['sp-adm-wt-app-filter-container']}>
            <div className={styles['sp-adm-wt-app-filter-icon-container']} onClick={handleSessionOpen}>
                <TuneIcon className={styles['sp-adm-wt-app-filter-icon']}/>
            </div>
            {sessionFilter ? (
                <div className={styles['sp-adm-wt-app-fiter-form-container']}>
                    <form action="">
                        <div>
                            <p>Fakültə</p>
                            <select name="faculty" id="faculty" value={sessionFaculty} onChange={handleSessionFaculty}>
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
