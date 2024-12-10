import { React, useState } from 'react';
import { useDropzone } from "react-dropzone";
import SchoolIcon from '@mui/icons-material/School';
import styles from "./FacultyAdminRegister.module.scss";
import FacultyAdminAside from "../FacultyAdminAside/FacultyAdminAside";

export default function FacultyAdminRegister() {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const onDrop = (acceptedFiles) => {
        // Update state with the dropped files
        setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "application/pdf, image/*", // Accept specific file types
        multiple: true, // Allow multiple files
        noClick: false
    });
    const removeFile = (fileName) => {
        // Remove a file based on its name
        setUploadedFiles((prevFiles) =>
            prevFiles.filter((file) => file.name !== fileName)
        );
    };
    return (
        <main className={styles['faculty-admin-main']}>
            <FacultyAdminAside />
            <section className={styles['fac-adm-register-section']}>
                <div className={styles['fac-adm-register-head-txt']}>
                    <div className={styles['fac-adm-register-digimeal-logo-container']}>
                        <SchoolIcon style={{ marginRight: 15, fontSize: 40 }} />
                        DigiMeal
                    </div>
                    <p>Yeni istifadəçi profili yaradın</p>
                </div>
                <div className={styles['fac-adm-register-form-container']}>
                    <form action="">
                        <div className={styles['fac-adm-reg-form-name-container']}>
                            <div className={styles['fac-adm-reg-name-label']}>
                                <input type="text" required />
                                <div className={styles['fac-adm-reg-name-placeholder']}>
                                    Ad
                                </div>
                            </div>
                            <div className={styles['fac-adm-reg-surname-label']}>
                                <input type="text" required />
                                <div className={styles['fac-adm-reg-surname-placeholder']}>
                                    Soy Ad
                                </div>
                            </div>
                            <div className={styles['fac-adm-reg-father-label']}>
                                <input type="text" required />
                                <div className={styles['fac-adm-reg-father-name-placeholder']}>
                                    Ata Adı
                                </div>
                            </div>
                        </div>
                        <div className={styles['fac-adm-reg-fin-code-label']}>
                            <input type="text" required />
                            <div className={styles['fac-adm-reg-fin-placeholder']}>
                                Fin Kod
                            </div>
                        </div>
                        <div className={styles['fac-adm-reg-id-label']}>
                            <input type="text" required />
                            <div className={styles['fac-adm-reg-id-placeholder']}>
                                ID
                            </div>
                        </div>
                        <div className={styles['fac-adm-reg-phone-label']}>
                            <input type="text" required />
                        </div>
                        <div className={styles['fac-adm-reg-faculty-label']}>
                            <input type="text" required />
                            <div className={styles['fac-adm-reg-fac-placeholder']}>
                                Fakültə
                            </div>
                        </div>
                        <div className={styles['fac-adm-reg-status-label']}>
                            <input type="text" required />
                            <div className={styles['fac-adm-reg-status-placeholder']}>
                                Status
                            </div>
                        </div>
                        <div className={styles['fac-adm-reg-ticket-label']}>
                            <input type="text" required />
                            <div className={styles['fac-adm-reg-ticket-placeholder']}>
                                Bilet
                            </div>
                        </div>
                        <div
                            {...getRootProps()}
                            className={styles['fac-adm-dropzone-container']}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p>Faylları bura buraxın...</p>
                            ) : (
                                <p>
                                    Faylları bura sürükləyib buraxın və ya faylları seçmək üçün klikləyin. <br />
                                    (Qəbul edilən formatlar: PDF, Şəkillər)
                                </p>
                            )}
                            {uploadedFiles.length > 0 && (
                                <div className={styles['fac-adm-reg-uploaded-doc-container']}>
                                    <h4>Yüklənmiş fayllar:</h4>
                                    <ul className={styles['fac-adm-reg-uploaded-doc-list']}>
                                        {uploadedFiles.map((file, index) => (
                                            <li key={index}>
                                                {file.name}{" "}
                                                <button onClick={() => removeFile(file.name)} style={{ marginLeft: "10px" }}>
                                                    Sil
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <button className={styles['fac-adm-reg-submit-btn']}>Qeydiyyat</button>
                    </form>
                </div>
            </section>
        </main>
    )
}
