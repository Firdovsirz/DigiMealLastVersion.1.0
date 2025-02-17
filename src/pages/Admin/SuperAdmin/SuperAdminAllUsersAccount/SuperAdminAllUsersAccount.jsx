import axios from 'axios';
import * as XLSX from 'xlsx';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import apiClient from "../../../../redux/apiClient";
import { useSelector, useDispatch } from 'react-redux';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from "./SuperAdminAllUsersAccount.module.scss";
import SuperAdminAside from '../SuperAdminAside/SuperAdminAside';
import SuperAdminAdditionalInfo from '../SuperAdminAdditionalInfo/SuperAdminAdditionalInfo';

export default function SuperAdminAllUsersAccount() {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationCount, setPaginationCount] = useState(1);
    const [error, setError] = useState(null);
    const [additonalInfo, setAdditionalInfo] = useState(false);
    const [additonalIndex, setAdditionalIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [qrCodeData, setQrCodeData] = useState({});  // Store QR Code data per user
    const itemsPerPage = 4; // You can adjust this based on your preference
    const [faculty, setFaculty] = useState('');
    const [filter, setFilter] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const token = useSelector((state) => state.superAdminAuth.token);

    useEffect(() => {
        // Check for token expiration on mount
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

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/get_all_user_account');
            if (response.data.success) {
                const data = response.data.data; // Adjusting for the structure sent from backend
                setStudents(data);
                setPaginationCount(Math.ceil(data.length / itemsPerPage)); // Set pagination count
            } else {
                setError(response.data.message || 'Failed to fetch data.');
            }
        } catch (err) {
            setError('Failed to fetch students. Please try again.');
            console.error(err);
        }
    };

    const fetchQRCodeData = async (username, month) => {
        try {
            const response = await apiClient.get('/get_qr_code_by_username', {
                params: {
                    username,
                    month, // Pass month parameter
                },
            });
            if (response.data.success) {
                setQrCodeData((prevData) => ({
                    ...prevData,
                    [username]: response.data.total_qiymet, // Store data by username
                }));
            } else {
                setQrCodeData((prevData) => ({
                    ...prevData,
                    [username]: null, // Store null if no data found
                }));
            }
        } catch (err) {
            console.error(err);
            setQrCodeData((prevData) => ({
                ...prevData,
                [username]: 'Error', // Store 'Error' if something went wrong
            }));
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

    const exportToExcel = () => {
        // Create a new workbook
        const wb = XLSX.utils.book_new();
    
        // Convert the data to a worksheet
        const ws = XLSX.utils.json_to_sheet(students);
    
        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        // Write the workbook to an Excel file
        XLSX.writeFile(wb, 'table_export.xlsx');
    };

    // Fetch QR code data for each user when the component mounts or when students are fetched
    // useEffect(() => {
    //     students.forEach((student) => {
    //         const username = student.digimealusername; // Use 'fin_kod' as the username (adjust if needed)
    //         const month = '02'; // Assuming you want to fetch data for February. Modify as needed.
    //         fetchQRCodeData(username, month);
    //     });
    // }, [students]); // Trigger when students are fetched

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
                                        <div className={styles['sp-adm-wait-app-additional-info-container']}>
                                            <div onClick={() => handleAdditonalInfo(index)}>
                                                <MoreHorizIcon />
                                            </div>
                                        </div>
                                        {/* Display QR code data */}
                                        <div>
                                            {fetchQRCodeData('20250000', '02')}
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
                <SuperAdminAdditionalInfo
                    object={students[additonalIndex]}
                    additionalInfo={additonalInfo}
                    setAdditionalInfo={setAdditionalInfo}
                />
            </main>
            <div className={styles['excel-export-btn']} style={{position: "fixed", top: 50, right: 200}} onClick={exportToExcel}>Export Excel</div>
        </>
    );
}
