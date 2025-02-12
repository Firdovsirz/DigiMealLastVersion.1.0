import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from "./SuperAdminApproved.module.scss";
import SuperAdminAside from '../SuperAdminAside/SuperAdminAside';
import AdminAdditionalInfo from '../../../../components/AdminAdditonalInfo/AdminAdditionalInfo';
import SuperAdminApprovedFilter from '../SuperAdminApprovedFilter/SuperAdminApprovedFilter';

export default function SuperAdminNotApproved() {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationCount, setPaginationCount] = useState(1);
    const [error, setError] = useState(null);
    const [additonalInfo, setAdditionalInfo] = useState(false);
    const [additonalIndex, setAdditionalIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [approvedFaculty, setApprovedFaculty] = useState('');
    const [approvedFilter, setApprovedFilter] = useState('');
    const itemsPerPage = 4;
    const handleAppFilterToggle = () => {
        setApprovedFilter(prev => !prev);
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/superadmin_approved/');
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
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // Update the search term state
    };

    const handleDelete = async (digimealusername) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/sesion_end/${digimealusername}`);
            if (response.status === 200) {
                setStudents(students.filter(student => student.digimealusername !== digimealusername));
                alert('Session ended successfully.');
            }
        } catch (err) {
            console.error('Failed to end session:', err);
            alert('Error ending session.');
        }
    };
    const filteredStudents = students
        .filter((student) => {
            // If faculty is selected, filter by faculty
            if (approvedFaculty) {
                return student.fakulte === approvedFaculty;
            }
            return true; // If no faculty is selected, include all students
        })
        .filter((student) => {
            // Filter by search term
            return (
                student.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.soyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.ata_adi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.fakulte.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    const paginatedData = filteredStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                            onChange={handleSearchChange}
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
                                        {/* <div>Status</div> */}
                                        {/* <div>Bilet</div> */}
                                        <div>Istifaçi adı</div>
                                        <div className={styles['sp-adm-wait-app-additional-info-txt']}>
                                            Əlavə məlumat
                                        </div>
                                        <div>Sessiyanı bitir</div>
                                    </div>
                                    <div className={styles['sp-not-apprv-student-details']}>
                                        <div>{student.ad}</div>
                                        <div>{student.soyad}</div>
                                        <div>{student.ata_adi}</div>
                                        <div>{student.fakulte}</div>
                                        {/* <div>{student.status}</div> */}
                                        {/* <div>{student.bilet}</div> */}
                                        <div>{student.digimealusername}</div>
                                        <div className={styles['sp-adm-wait-app-additional-info-container']}>
                                            <div onClick={() => handleAdditonalInfo(index)}>
                                                <MoreHorizIcon />
                                            </div>
                                        </div>
                                        <div className={styles['sp-adm-wait-app-remove-btn-container']}>
                                            <div onClick={() => handleDelete(student.digimealusername)}>
                                                <DeleteIcon />
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
                <SuperAdminApprovedFilter 
                    approvedFaculty={approvedFaculty}
                    setApprovedFaculty={setApprovedFaculty}
                    approvedFilter={approvedFilter}
                    handleApprovedOpen={handleAppFilterToggle} />
            </main>
        </>
    );
}