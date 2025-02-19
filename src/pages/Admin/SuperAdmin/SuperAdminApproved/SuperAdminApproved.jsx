import axios from 'axios';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from "./SuperAdminApproved.module.scss";
import { useSelector, useDispatch } from 'react-redux';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SuperAdminAside from '../SuperAdminAside/SuperAdminAside';
import { clearSuperAdminAuth } from '../../../../redux/superAdminAuthSlice';
import SuperAdminApprovedFilter from '../SuperAdminApprovedFilter/SuperAdminApprovedFilter';
import AdminAdditionalInfo from '../../../../components/AdminAdditonalInfo/AdminAdditionalInfo';

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
        setSearchTerm(event.target.value);
    };

    const handleDelete = async (digimealusername) => {
        const isConfirmed = confirm("Sessiyanı bitirmək istədiyinizə əminsiniz?");
        if (isConfirmed) {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/sesion_end/${digimealusername}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setStudents(students.filter(student => student.digimealusername !== digimealusername));
                    alert('Sessiya uğurlu bitirildi.');
                }
            } catch (err) {
                console.error('Failed to end session:', err);
                alert('Xəta baş verdi.');
            }
        }
    };
    
    const filteredStudents = students
        .filter((student) => {
            if (approvedFaculty) {
                return student.fakulte === approvedFaculty;
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
                            placeholder="Axtarın..."
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
                            !error && <p style={{color: "#fff", fontSize: 20}}>Heç bir tələbə  tapılmadı.</p>
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