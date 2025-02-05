import axios from 'axios';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import React, { useState, useEffect } from 'react';
import apiClient from '../../../../redux/apiClient';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import styles from './FacultyadminWaitingApproved.module.scss';
import FacultyAdminAside from "../FacultyAdminAside/FacultyAdminAside";
import AdminAdditionalInfo from '../../../../components/AdminAdditonalInfo/AdminAdditionalInfo';

export default function FacultyadminNotApproved() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [faculty, setFaculty] = useState('');
    const [searchTerm, setSearchTerm] = useState('');  // Added search term state
    const rowsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const [adminAsideName, setAdminAsideName] = useState('');
    const adminUsername = useSelector((state) => state.adminAuth.username);
    const adminToken = useSelector((state) => state.adminAuth.token);
    const isAdminAuthenticated = useSelector((state) => state.adminAuth.isAuthenticated);
    const [additonalInfo, setAdditionalInfo] = useState(false);
    const [additonalIndex, setAdditionalIndex] = useState(0);

    useEffect(() => {
        if (!isAdminAuthenticated) {
            console.log('Admin is not authenticated!');
            return;
        }

        const fetchFacultyName = async () => {
            try {
                const response = await apiClient.post(
                    '/admin/get_admin_username',
                    { usernameadmin: adminUsername },
                    {
                        headers: {
                            Authorization: `Bearer ${adminToken}`,
                        },
                    }
                );

                if (response.data.success) {
                    setAdminAsideName(response.data.results[0].istifadeciadi);
                    setFaculty(response.data.results[0].faculty);
                } else {
                    console.error('Error fetching faculty name:', response.data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (adminUsername) {
            fetchFacultyName();
        }
    }, [adminUsername, adminToken, isAdminAuthenticated, faculty]);

    const fetchNotApprovedStudents = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/notapproved/${faculty}`);
            setStudents(response.data.results || []);
            setError('');
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Something went wrong.');
            } else if (err.request) {
                setError('No response from the server. Please try again.');
            } else {
                setError('Failed to fetch data. Please try again.');
            }
            setStudents([]);
        }
    };

    useEffect(() => {
        if (faculty) {
            fetchNotApprovedStudents();
        }
    }, [faculty]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (faculty) fetchNotApprovedStudents();
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredStudents = students.filter((student) => {
        // You can adjust the filter criteria here. 
        // For example, to search by name, faculty, etc.
        return (
            student.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.soyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.fakulte.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const paginatedData = filteredStudents.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const paginationCount = Math.ceil(filteredStudents.length / rowsPerPage);

    const handleAdditonalInfo = (e) => {
        setAdditionalInfo(true);
        setAdditionalIndex(e)
    };

    return (
        <>
            <main className={styles['fac-adm-not-approved-main']}>
                <FacultyAdminAside facultyName={adminAsideName} />
                <section className={styles['not-approved-students-section']}>
                    <h1>Təsdiq gözləyən istifadəçilər</h1>
                    <form action="" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                        />
                    </form>
                    <div className={styles['not-approved-students-container']}>
                        {error && <div className={styles['error']}>{error}</div>}
                        {paginatedData.length > 0 ? (
                            paginatedData.map((student, index) => (
                                <div key={index} className={styles['student-card']}>
                                    <div className={styles['not-apprv-student-head']}>
                                        <div>Ad</div>
                                        <div>Soyad</div>
                                        <div>Ata adı</div>
                                        <div>Fakültə</div>
                                        <div>Qrup</div>
                                        <div className={styles['fc-adm-wait-app-additional-info-txt']}>
                                            Əlavə məlumat
                                        </div>
                                    </div>
                                    <div className={styles['not-apprv-student-details']}>
                                        <div>{student.ad}</div>
                                        <div>{student.soyad}</div>
                                        <div>{student.ata_adi}</div>
                                        <div>{student.fakulte}</div>
                                        <div>{student.qrup_no}</div>
                                        <div className={styles['fc-adm-wait-app-additional-info-container']}>
                                            <div onClick={() => handleAdditonalInfo(index)}>
                                                <MoreHorizIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !error && <p>No students found for the specified faculty.</p>
                        )}
                    </div>
                    <div className={styles['fac-adm-waiting-approve-pagination']}>
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
                    setAdditionalInfo={setAdditionalInfo} 
                />
            </main>
        </>
    );
}