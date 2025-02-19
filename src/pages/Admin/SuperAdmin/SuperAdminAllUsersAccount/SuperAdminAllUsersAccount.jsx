import * as XLSX from 'xlsx';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import apiClient from '../../../../redux/apiClient';
import { useSelector, useDispatch } from 'react-redux';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from "./SuperAdminAllUsersAccount.module.scss";
import SuperAdminAside from '../SuperAdminAside/SuperAdminAside';
import { clearSuperAdminAuth } from '../../../../redux/superAdminAuthSlice';
import SuperAdminAllUsersAccountDisplay from './SuperAdminAllUsersAccountDisplay';
import SuperAdminAdditionalInfo from '../SuperAdminAdditionalInfo/SuperAdminAdditionalInfo';
import SuperAdminAllUsersFilterAccount from '../SuperAdminAllUsersFilterAccount/SuperAdminAllUsersFilterAccount';

export default function SuperAdminAllUsersAccount() {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationCount, setPaginationCount] = useState(1);
    const [error, setError] = useState(null);
    const [additonalInfo, setAdditionalInfo] = useState(false);
    const [additonalIndex, setAdditionalIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState(false);

    const itemsPerPage = 4; // You can adjust this based on your preference
    const [faculty, setFaculty] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(('0' + (new Date().getMonth() + 1)).slice(-2));
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
        fetchStudents();
    }, [token, navigate, dispatch]);

    const fetchQRCodeData = async (username, month, year) => {
        try {
            const response = await apiClient.get('/get_qr_code_by_username', {
                params: { username, month, year },

                headers: {
                    Authorization: `Bearer ${token}`,
                },

            });
            if (response.data.success) {
                return response.data.total_qiymet;
            } else {
                return 0;
            }
        } catch (err) {
            console.error('Failed to fetch QR code data:', err);
            return 0;
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await apiClient.get('/get_all_user_account', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                const studentsData = response.data.data;

                const studentsWithQRCode = await Promise.all(
                    studentsData.map(async (student) => {
                        const qrCodeData = await fetchQRCodeData(student.digimealusername, month, year);
                        return { ...student, qrCodeData };
                    })
                );

                setStudents(studentsWithQRCode);
                setPaginationCount(Math.ceil(studentsWithQRCode.length / itemsPerPage)); // Set pagination count
            } else {
                setError(response.data.message || 'Failed to fetch data.');
            }
        } catch (err) {
            setError('Failed to fetch students. Please try again.');
            console.error(err);
        }
    };


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleAdditonalInfo = (e) => {
        setAdditionalInfo(true);
        setAdditionalIndex(e);
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

    const toggleFilter = () => {
        setFilter(!filter);
    }
    useEffect(() => {
        fetchStudents();
    }, [month]);
    console.log(students);
    const exportedData = students.map((item) => ({
        Ad: item.ad,
        Soyad: item.soyad,
        Ata_adı: item.ata_adi,
        Fin_kod: item.fin_kod,
        Vəzifəsi: item.status,
        Yemək_xərci: item.qrCodeData,
        Qeyd: item.qyed
    }))
    
    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Students');
        XLSX.writeFile(wb, `${year}-${month}.xlsx`);
    };


    return (
        <>
            <main className={styles['sp-adm-not-approved-main']}>
                <SuperAdminAside />
                <section className={styles['sp-not-approved-students-section']}>
                    <h1>Bütün istifadəçilər</h1>
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
                            paginatedData.map((student, index) => (
                                <div key={index} className={styles['student-card']}>
                                    <div className={styles['sp-not-apprv-student-head']}>
                                        <div>Ad, Soyad, Ata adı</div>
                                        <div>Fin kod</div>
                                        <div>Vəzifə</div>
                                        <div>Yemək xərci</div>
                                        <div>Qeydiyyat tarixi</div>
                                        <div>Fakültə</div>
                                        <div>Sessiya</div>
                                        <div>Qiymet</div>
                                        <div className={styles['sp-adm-wait-app-additional-info-txt']}>
                                            Əlavə məlumat
                                        </div>
                                    </div>
                                    <div className={styles['sp-not-apprv-student-details']}>
                                        <div>{student.ad} {student.soyad} {student.ata_adi}</div>
                                        <div>{student.fin_kod}</div>
                                        <div>{student.status}</div>
                                        <div>{student.status}</div>
                                        <div>{student.qeydiyyat_tarixi}</div>
                                        <div>{student.fakulte}</div>
                                        <div>{JSON.stringify(student.sessiya).replace(/[{}\"\\]/g, '').trim().split(",")[0].split(" ")[1]}</div>
                                        <div>
                                            {/* <SuperAdminAllUsersAccountDisplay username={student.digimealusername} month={month} qrCodeData={student.qrCodeData} /> */}
                                            {student.qrCodeData}
                                        </div>
                                        <div className={styles['sp-adm-wait-app-additional-info-container']}>
                                            <div onClick={() => handleAdditonalInfo(index)}>
                                                <MoreHorizIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !error && <p>No students found.</p>
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
                <div style={{
                    position: "fixed",
                    top: 65,
                    right: 200,
                    color: "#fff"
                }} onClick={exportToExcel}>Excell endirin</div>
                <SuperAdminAdditionalInfo
                    object={students[additonalIndex]}
                    additionalInfo={additonalInfo}
                    setAdditionalInfo={setAdditionalInfo}
                />
                <SuperAdminAllUsersFilterAccount
                    accountFilter={filter}
                    setMonth={setMonth}
                    setYear={setYear}
                    toggleFilter={toggleFilter}
                />
            </main>
        </>
    );
}
