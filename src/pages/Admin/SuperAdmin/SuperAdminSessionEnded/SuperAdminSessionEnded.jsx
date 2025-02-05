import axios from 'axios';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from "./SuperAdminSessionEnded.module.scss";
import SuperAdminAside from '../SuperAdminAside/SuperAdminAside';
import AdminAdditionalInfo from '../../../../components/AdminAdditonalInfo/AdminAdditionalInfo';

export default function SuperAdminNotApproved() {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationCount, setPaginationCount] = useState(1);
    const [error, setError] = useState(null);
    const [additonalInfo, setAdditionalInfo] = useState(false);
    const [additonalIndex, setAdditionalIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 4;

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/superadmin_session_ended/');
                const data = response.data.results;
                setStudents(data);
                setPaginationCount(Math.ceil(data.length / itemsPerPage));
            } catch (err) {
                setError('Failed to fetch students.');
                console.error(err);
            }
        };

        fetchStudents();
    }, []);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleAdditonalInfo = (e) => {
        setAdditionalInfo(true);
        setAdditionalIndex(e);
    };

    const paginatedData = students.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const handleRecover = async (digimealusername) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/sesion_recover/${digimealusername}`);
            if (response.status === 200) {
                setStudents(students.filter(student => student.digimealusername !== digimealusername));
                alert('Sessiya uğurla redaktə olundu');
            }
        } catch (err) {
            console.error('Failed to end session:', err);
            alert('Redaktə zamanı xəta baş verdi');
        }
    };

    return (
        <>
            <main className={styles['sp-adm-not-approved-main']}>
                <SuperAdminAside />
                <section className={styles['sp-not-approved-students-section']}>
                    <h1>Təsdiqlənmiş istifadəçilər</h1>
                    <form action="">
                        <input
                            type="text"
                            required
                            placeholder="Search..."
                            value={searchTerm}
                        />
                    </form>
                    <div className={styles['sp-not-approved-students-container']}>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((student, index) => (
                                <div key={index} className={styles['student-card']}>
                                    <div className={styles['sp-not-apprv-student-head']}>
                                        <div>Ad</div>
                                        <div>Soyad</div>
                                        <div>Ata adı</div>
                                        <div>Fakültə</div>
                                        <div>Status</div>
                                        <div>Bilet</div>
                                        <div>Istifaçi adı</div>
                                        <div className={styles['sp-adm-wait-app-additional-info-txt']}>
                                            Əlavə məlumat
                                        </div>
                                        <div>Sessiyanı redaktə et</div>
                                    </div>
                                    <div className={styles['sp-not-apprv-student-details']}>
                                        <div>{student.ad}</div>
                                        <div>{student.soyad}</div>
                                        <div>{student.ata_adi}</div>
                                        <div>{student.fakulte}</div>
                                        <div>{student.status}</div>
                                        <div>{student.bilet}</div>
                                        <div>{student.digimealusername}</div>
                                        <div className={styles['sp-adm-wait-app-additional-info-container']}>
                                            <div onClick={() => handleAdditonalInfo(index)}>
                                                <MoreHorizIcon />
                                            </div>
                                        </div>
                                        <div className={styles['sp-adm-wait-app-remove-btn-container']}>
                                            <div onClick={() => handleRecover(student.digimealusername)}>
                                                <AutorenewIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !error && <p>No students found for the specified faculty.</p>
                        )}
                        {error && <p className={styles['error-message']}>{error}</p>}
                    </div>
                    <div className={styles['sp-adm-waiting-approve-pagination']}>
                        <Stack spacing={2} className={styles['pagination-component']}>
                            <Pagination
                                count={paginationCount}
                                page={currentPage}
                                onChange={handlePageChange}
                            />
                        </Stack>
                    </div>
                </section>
                <AdminAdditionalInfo
                    object={students[additonalIndex]}
                    additionalInfo={additonalInfo}
                    setAdditionalInfo={setAdditionalInfo} />
            </main>
        </>
    );
}