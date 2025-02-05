import React, { useState } from "react";
import TuneIcon from '@mui/icons-material/Tune';
import styles from "./SuperAdminAccount.module.scss";
import SuperAdminAside from '../SuperAdminAside/SuperAdminAside';

const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

export default function SuperAdminAccount({ data }) {
    const startYear = 2025;
    const years = Array.from({ length: 50 }, (_, i) => startYear + i);

    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedWeek, setSelectedWeek] = useState('');
    const [filter, setFilter] = useState(false);
    const months = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
    ];

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };
    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };
    const handleWeekChange = (e) => {
        setSelectedWeek(e.target.value);
    };
    const handleFitler = () => {
        setFilter(!filter);
    }


    return (
        <>
            <main className={styles['sp-adm-account-main']}>
                <SuperAdminAside />
                <section className={styles['sp-adm-account-section']}>
                    <h1>Hesabat</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Bufet adı</th>
                                <th>Qiymət</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                </tr>
                            ))} */}
                            <tr>
                                <td>Bufet 1</td>
                                <td>{`${'qiymet'}`}</td>
                            </tr>
                            <tr>
                                <td>Bufet 2</td>
                                <td>{`${'qiymet'}`}</td>
                            </tr>
                            <tr>
                                <td>Bufet 3</td>
                                <td>{`${'qiymet'}`}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Yekun Qiymət</th>
                                <th>{`${'qiymet'}`}</th>
                            </tr>
                        </tfoot>
                    </table>
                </section>
                <aside className={styles['sp-adm-account-filter']} style={!filter ? { marginRight: '-310px' } : { marginRight: 0 }}>
                    <TuneIcon className={styles['sp-adm-acc-fltr-icon']} onClick={handleFitler} />
                    <div className={styles['sp-adm-acc-filter-container']}>
                        <form action="" className={styles['search-form']}>
                            <input type="text" placeholder='Axtarın' />
                        </form>
                        <form action="" className={styles['date-form']}>
                            <div className={styles['sp-adm-acc-filter-year-selection']}>
                                {selectedYear.length !== 0 ? selectedYear : <p>İl seçin</p>}
                                <div className={styles['sp-adm-acc-filter-year-list']}>
                                    <select id="year" onChange={handleYearChange}>
                                        {years.map((year, index) => (
                                            <option key={index} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className={styles['month-input-container']}>
                                {selectedMonth.length !== 0 ? selectedMonth : <p>Ay seçin</p>}
                                <select id="month" onChange={handleMonthChange}>
                                    {months.map((month, index) => (
                                        <option key={index} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles['week-input-container']}>
                                {selectedWeek.length !== 0 ? selectedWeek : <p>Həftə seçin</p>}
                                <select id="week" onChange={handleWeekChange}>
                                    {Array.from({ length: 53 }, (_, i) => i + 1).map((week) => (
                                        <option key={week} value={week}>{week}</option>
                                    ))}
                                </select>
                            </div>
                        </form>
                    </div>
                </aside>
            </main>
        </>
    );
}