import React, { useState } from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import styles from "./SuperAdminAccountFilter.module.scss";

export default function SuperAdminSessionFilter({ accountFilter, setAccountFilter, setYear, setMonth, setWeek, toggleFilter }) {
    const startYear = 2025;
    const years = [];
    for (let i = 0; i < 10; i++) {
        years.push(startYear + i);
    }
    const months = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
        "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
    ];
    const weeks = [
        "1-ci Həftə", "2-ci Həftə", "3-cü Həftə", "4-cü Həftə", "5-ci Həftə"
    ];

    return (
        <div className={styles['sp-adm-wt-app-filter-container']}>
            <div className={styles['sp-adm-wt-app-filter-icon-container']} onClick={toggleFilter}>
                <TuneIcon className={styles['sp-adm-wt-app-filter-icon']} />
            </div>
            {accountFilter ? (
                <div className={styles['sp-adm-wt-app-fiter-form-container']}>
                    <form action="">
                        <select name="year" id="year" onChange={(e) => setYear(e.target.value)}>
                            <option value="">İL</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                            <option value="2030">2030</option>
                            <option value="2031">2031</option>
                            <option value="2032">2032</option>
                            <option value="2033">2033</option>
                            <option value="2034">2034</option>
                        </select>
                        <select name="month" id="month" onChange={(e) => setMonth(e.target.value)}>
                            <option value="">Ay</option>
                            <option value="01">Yanvar</option>
                            <option value="02">Fevral</option>
                            <option value="03">Mart</option>
                            <option value="04">Aprel</option>
                            <option value="05">May</option>
                            <option value="06">İyun</option>
                            <option value="07">İyul</option>
                            <option value="08">Avqust</option>
                            <option value="09">Sentyabr</option>
                            <option value="10">Oktyabr</option>
                            <option value="11">Noyabr</option>
                            <option value="12">Dekabr</option>
                        </select>
                        {/* <select name="week" id="week" onChange={(e) => setWeek(e.target.value)}>
                            {weeks.map((week, index) => (
                                <option key={index} value={week[0]}>
                                    {week}
                                </option>
                            ))}
                        </select> */}
                        <button type="submit">Filter</button>
                    </form>
                </div>
            ) : null}
        </div>
    );
}
