import axios from 'axios';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from "./SuperAdminSessionEnded.module.scss";
import SuperAdminAside from '../SuperAdminAside/SuperAdminAside';
import { clearSuperAdminAuth } from '../../../../redux/superAdminAuthSlice';
import SuperAdminSessionFilter from '../SuperAdminSessionFilter/SuperAdminSessionFilter';
import AdminAdditionalInfo from '../../../../components/AdminAdditonalInfo/AdminAdditionalInfo';
import apiClient from '../../../../redux/apiClient';

export default function SuperAdminNotApproved() {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationCount, setPaginationCount] = useState(1);
    const [error, setError] = useState(null);
    const [additonalInfo, setAdditionalInfo] = useState(false);
    const [additonalIndex, setAdditionalIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sessionFaculty, setSessionFaculty] = useState('');
    const [sessionFilter, setSessionFilter] = useState('');
    const itemsPerPage = 4;

    const handleSessionFilterToggle = () => {
        setSessionFilter(prev => !prev);
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    
    const token = useSelector((state) => state.superAdminAuth.token);

    useEffect(() => {
        const checkTokenExpiration = () => {
                    if (!token) {
                        navigate("/super-admin-login", { replace: true });
                        return;
                    }
        
                    try {
                        const decodedToken = JSON.parse(atob(token.split('.')[1]));
                        const expirationTime = decodedToken.exp * 1000;
                        const currentTime = Date.now();
                        if (currentTime >= expirationTime) {
                            dispatch(clearSuperAdminAuth());
                            localStorage.removeItem('authToken');
                            navigate("/super-admin-login", { replace: true });
                        }
                    } catch (error) {
                        console.error("Error decoding token:", error);
                        dispatch(clearSuperAdminAuth());
                        navigate("/super-admin-login", { replace: true });
                    }
                };

                checkTokenExpiration();
        const fetchStudents = async () => {
            try {
                const response = await apiClient.get('/superadmin_session_ended/',{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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
    const filteredStudents = students
        .filter((student) => {
            if (sessionFaculty) {
                return student.fakulte === sessionFaculty;
            }
            return true;
        })
        .filter((student) => {
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
    const handleRecover = async (digimealusername) => {
        const isConfirmed = confirm("Sessiyanı redaktə etməyə əminsiniz?");
        if (isConfirmed) {
            try {
                const response = await apiClient.get(`/sesion_recover/${digimealusername}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setStudents(students.filter(student => student.digimealusername !== digimealusername));
                    alert('Sessiya uğurla redaktə olundu.');
                }
            } catch (err) {
                console.error('Failed to end session:', err);
                alert('Redaktə zamanı xəta baş verdi');
            }
        }
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <>
            <main className={styles['sp-adm-not-approved-main']}>
                <SuperAdminAside />
                <section className={styles['sp-not-approved-students-section']}>
                    <h1>Sessiyası bitmiş istifadəçilər</h1>
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
                <SuperAdminSessionFilter
                    handleSessionOpen={handleSessionFilterToggle}
                    sessionFaculty={sessionFaculty}
                    setSessionFaculty={setSessionFaculty}
                    sessionFilter={sessionFilter} />
            </main>
        </>
    );
}