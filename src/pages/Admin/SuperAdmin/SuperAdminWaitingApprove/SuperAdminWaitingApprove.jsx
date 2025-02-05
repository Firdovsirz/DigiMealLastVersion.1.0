import axios from 'axios';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from "./SuperAdminWaitingApprove.module.scss";
import SuperAdminAside from '../SuperAdminAside/SuperAdminAside';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AdminAdditionalInfo from '../../../../components/AdminAdditonalInfo/AdminAdditionalInfo';
import SuperAdminConfirmUser from '../SuperAdminConfirmUser/SuperAdminConfirmUser';

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
    const handleConfirmUserContainer = (e) => {
        setConfirm(true);
        setConfirmUserEmail(e)
    }
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
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/superadmin_notapproved/');
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredStudents = students.filter((student) =>
        student.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.soyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.ata_adi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.fakulte.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    // Refresh the student list after deletion
                    setStudents(students.filter(student => student.fin_kod !== finKod));
                }
            } catch (err) {
                console.error(err);
                alert('Failed to delete user. Please try again.');
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
                                        <div>{student.status}</div>
                                        <div>{student.bilet}</div>
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
                <SuperAdminConfirmUser
                    confirmUser={confirm}
                    setConfirmUser={setConfirm}
                    email={confirmUserEmail}/>
            </main>
        </>
    );
}