import axios from 'axios';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from "./SuperAdminWaitingApprove.module.scss";
import SuperAdminAside from '../SuperAdminAside/SuperAdminAside';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { clearSuperAdminAuth } from '../../../../redux/superAdminAuthSlice';
import SuperAdminConfirmUser from '../SuperAdminConfirmUser/SuperAdminConfirmUser';
import AdminAdditionalInfo from '../../../../components/AdminAdditonalInfo/AdminAdditionalInfo';
import SuperAdminWaitingApproveFilter from '../SuperAdminWaitingApproveFilter/SuperAdminWaitingApproveFilter';

export default function SuperAdminNotApproved() {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationCount, setPaginationCount] = useState(1);
    const [error, setError] = useState(null);
    const [additonalInfo, setAdditionalInfo] = useState(false);
    const [additonalIndex, setAdditionalIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 4;
    const [confirm, setConfirm] = useState(false);
    const [confirmUserEmail, setConfirmUserEmail] = useState('');
    const [faculty, setFaculty] = useState('');
    const handleConfirmUserContainer = (e) => {
        setConfirm(true);
        setConfirmUserEmail(e)
    }
    const [filter, setFilter] = useState(false);
    const handleFilterToggle = () => {
        setFilter(prev => !prev);
    };
    const requestOtp = async (email) => {
        try {
            const response = await axios.post(`/request-otp/${email}`);
            if (response.status === 200) {
                setSuccessMessage('OTP başarıyla gönderildi!');
                setErrorMessage('');
                setIsOtpRequested(true);
            } else {
                setErrorMessage('OTP gönderilemedi. Lütfen tekrar deneyin.');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.'
            );
            setSuccessMessage('');
        }
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
                const response = await axios.get('http://127.0.0.1:5000/superadmin_notapproved/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = response.data.results;
                setStudents(data);
                setPaginationCount(Math.ceil(data.length / itemsPerPage));
            } catch (err) {
                setError('Xəta baş verdi.');
                console.error(err);
            }
        };

        fetchStudents();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredStudents = students
        .filter((student) => {
            if (faculty) {
                return student.fakulte === faculty;
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

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleAdditonalInfo = (e) => {
        setAdditionalInfo(true);
        setAdditionalIndex(e);
    };

    const handleDelete = async (finKod) => {
        if (window.confirm(`Istifadəçini təsdiq etməməyə əminsiniz? FIN kod: ${finKod}?`)) {
            try {
                const response = await axios.delete(`http://127.0.0.1:5000/delete_user/${finKod}`);
                if (response.status === 200) {
                    alert(response.data.message);
                    setStudents(students.filter(student => student.fin_kod !== finKod));
                }
            } catch (err) {
                console.error(err);
                alert('Xəta baş verdi.');
            }
        }
    };

    return (
        <>
            <main className={styles['sp-adm-not-approved-main']}>
                <SuperAdminAside />
                <section className={styles['sp-not-approved-students-section']}>
                    <h1>Təsdiq gözləyən istifadəçilər</h1>
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
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, index) => (
                                <div key={index} className={styles['student-card']}>
                                    <div className={styles['sp-not-apprv-student-head']}>
                                        <div>Ad</div>
                                        <div>Soyad</div>
                                        <div>Ata adı</div>
                                        <div>Fakültə</div>
                                        {/* <div>Status</div> */}
                                        {/* <div>Bilet</div> */}
                                        <div className={styles['sp-adm-wait-app-additional-info-txt']}>
                                            Əlavə məlumat
                                        </div>
                                        <div>Ləğv et</div>
                                        <div>Təsdiq et</div>
                                    </div>
                                    <div className={styles['sp-not-apprv-student-details']}>
                                        <div>{student.ad}</div>
                                        <div>{student.soyad}</div>
                                        <div>{student.ata_adi}</div>
                                        <div>{student.fakulte}</div>
                                        {/* <div>{student.status}</div> */}
                                        {/* <div>{student.bilet}</div> */}
                                        <div className={styles['sp-adm-wait-app-additional-info-container']}>
                                            <div onClick={() => handleAdditonalInfo(index)}>
                                                <MoreHorizIcon />
                                            </div>
                                        </div>
                                        <div className={styles['sp-adm-wait-app-remove-btn-container']}>
                                            <div onClick={() => handleDelete(student.fin_kod)}>
                                                <DeleteIcon />
                                            </div>
                                        </div>
                                        <div className={styles['sp-adm-wait-app-approve-btn-container']}>
                                            <div onClick={() => handleConfirmUserContainer(student.email)}>
                                                <CheckCircleOutlineIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !error && <p style={{color: "#fff", fontSize: 20}}>Tələbə tapılmadı.</p>
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
                <SuperAdminConfirmUser
                    confirmUser={confirm}
                    setConfirmUser={setConfirm}
                    email={confirmUserEmail}/>
                <SuperAdminWaitingApproveFilter 
                    handleOpen={handleFilterToggle} 
                    filter={filter} 
                    setFilter={setFilter}
                    faculty={faculty}
                    setFaculty={setFaculty}/>
            </main>
        </>
    );
}