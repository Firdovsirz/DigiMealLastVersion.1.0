import { React, useState } from 'react';
import { useDropzone } from "react-dropzone";
import SchoolIcon from '@mui/icons-material/School';
import styles from "./FacultyAdminRegister.module.scss";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FacultyAdminAside from "../FacultyAdminAside/FacultyAdminAside";

export default function FacultyAdminRegister() {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState('+994 (__) ___ __ __');
    const [prefix, setPrefix] = useState('');
    const [prefixDropdown, setPrefixDropdown] = useState(false);
    const handlePrefix = (e) => {
        setPrefix(e.target.value);
        setPrefixDropdown(!prefixDropdown);
        console.log(prefix);
    }
    const handlePrefixDropdown = () => {
        setPrefixDropdown(!prefixDropdown);
    }
    const handlePhoneNumber = (e) => {
        const input = e.target.value;

        // Remove non-numeric characters, except for the "+" in the prefix
        const inputDigits = input.replace(/[^0-9]/g, "");

        // Ensure the prefix "+994" is always retained
        const digitsWithoutPrefix = inputDigits.startsWith("994") ? inputDigits.slice(3) : inputDigits;

        // Format the remaining digits and set the value
        setPhoneNumber(formatPhoneNumber(digitsWithoutPrefix));
    };

    const formatPhoneNumber = (digits) => {
        const mask = "+994 (__) ___ __ __"; // Phone number mask
        let formatted = "+994 (";
        let digitIndex = 0;

        for (let i = 6; i < mask.length; i++) {
            if (mask[i] === "_") {
                // Replace placeholders with digits if available
                formatted += digitIndex < digits.length ? digits[digitIndex] : "_";
                digitIndex++;
            } else {
                // Keep formatting characters (e.g., spaces, parentheses)
                formatted += mask[i];
            }
        }

        return formatted;
    };

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
                            <div className={styles['fac-adm-reg-phone-prefix']}>
                                <div className={styles['fac-adm-reg-phone-prefix-head']} onClick={handlePrefixDropdown}>
                                    Prefix
                                    <ArrowDropDownIcon
                                        style={prefixDropdown ?
                                            { rotate: '180deg', transition: 'all 400ms' } :
                                            { rotate: '0deg', transition: 'all 400ms' }} />
                                </div>
                                <div
                                    className={styles['fac-adm-reg-phone-preffix-list']}
                                    style={prefixDropdown ? { display: 'block' } : { display: 'none' }}>
                                    <ul>
                                        <li onClick={(e) => { handlePrefix(e) }}>55</li>
                                        <li onClick={(e) => { handlePrefix(e) }}>99</li>
                                        <li onClick={(e) => { handlePrefix(e) }}>50</li>
                                        <li onClick={(e) => { handlePrefix(e) }}>51</li>
                                        <li onClick={(e) => { handlePrefix(e) }}>10</li>
                                        <li onClick={(e) => { handlePrefix(e) }}>70</li>
                                        <li onClick={(e) => { handlePrefix(e) }}>77</li>
                                    </ul>
                                </div>
                            </div>
                            <input
                                type="text"
                                required
                                value={phoneNumber}
                                onChange={(e) => { handlePhoneNumber(e) }} />
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
