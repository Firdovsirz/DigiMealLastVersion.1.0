import axios from "axios";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import React, { useState, useEffect } from "react";
import apiClient from "../../../../redux/apiClient";
import SchoolIcon from "@mui/icons-material/School";
import styles from "./FacultyAdminRegister.module.scss";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FacultyAdminAside from "../FacultyAdminAside/FacultyAdminAside";

export default function FacultyAdminRegister() {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState("+994 (__) ___ __ __");
    const [prefix, setPrefix] = useState("");
    const [faculty, setFacultyName] = useState("");
    const [adminAsideName, setAdminAsideName] = useState('');
    const [prefixDropdown, setPrefixDropdown] = useState(false);
    const adminUsername = useSelector((state) => state.adminAuth.username);
    const adminToken = useSelector((state) => state.adminAuth.token);
    const isAdminAuthenticated = useSelector((state) => state.adminAuth.isAuthenticated);
    const [facDropdown, setFacDropdown] = useState(false);
    const handleFacDropdown = () => {
        setFacDropdown(!facDropdown);
    }
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    useEffect(()=>{
        setWindowHeight(window.innerHeight);
    }, [window.innerHeight]);

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
                    const facultyName = response.data.results[0].faculty;
                    setFacultyName(facultyName);

                    // Set the formData's fakulte to the fetched faculty name
                    setFormData((prevData) => ({
                        ...prevData,
                        fakulte: facultyName, // Set fakulte to faculty name by default
                    }));
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
    }, [adminUsername, adminToken, isAdminAuthenticated]);
    console.log(adminUsername, faculty);
    const [currentDay, setCurrentDay] = useState('');

    useEffect(() => {
        // Function to get current date in YYYY-MM-DD format
        const getCurrentDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Ensure two digits for the month
            const day = today.getDate().toString().padStart(2, '0'); // Ensure two digits for the day
            
            return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
        };
    
        // Set the current date in the state
        setCurrentDay(getCurrentDate());
    }, []);
    // console.log(currentDay);
    

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        fathername: "",
        fincode: "",
        phonenumber: "",
        fakulte: "",
        groupnumber: "",
        status: "",
        bilet: "",
        email: "",
        registrationDate: "",
        note: "",
        document: []
    });
    useEffect(() => {
        // Update registrationDate once currentDay is set
        if (currentDay) {
            setFormData((prevData) => ({
                ...prevData,
                registrationDate: currentDay, // Update registrationDate dynamically
            }));
        }
    }, [currentDay]);
    

    const handlePrefix = (selectedPrefix) => {
        setPrefix(selectedPrefix);
        const digits = phoneNumber.replace(/[^0-9]/g, "").slice(5); // Extract digits after "+994 (XX)"
        setPhoneNumber(formatPhoneNumber(digits, selectedPrefix)); // Update the phone number with the new prefix
        setPrefixDropdown(false); // Close the dropdown
    };

    const handlePrefixDropdown = () => {
        setPrefixDropdown(!prefixDropdown);
    };

    const handlePhoneNumber = (e) => {
        const input = e.target.value;
        const lastKey = e.nativeEvent.inputType; // Detect key pressed
        const numericInput = input.replace(/[^0-9]/g, ""); // Remove non-numeric characters
        const prefixLength = prefix ? prefix.length : 0;

        let digits = numericInput.slice(3 + prefixLength); // Extract digits after the prefix
        if (lastKey === "deleteContentBackward" && digits.length > 0) {
            // Remove the last digit when backspace is pressed
            digits = digits.slice(0, -1);
        }

        const formattedPhoneNumber = formatPhoneNumber(digits, prefix);
        setPhoneNumber(formattedPhoneNumber);

        // Update formData with the new phone number
        setFormData((prevData) => ({
            ...prevData,
            phonenumber: formattedPhoneNumber,
        }));
    };

    const formatPhoneNumber = (digits, currentPrefix) => {
        const basePrefix = currentPrefix ? currentPrefix.padEnd(2, "_") : "__";
        let formatted = `+994 (${basePrefix}) `;
        const mask = "___ __ __";
        let digitIndex = 0;

        for (let i = 0; i < mask.length; i++) {
            if (mask[i] === "_") {
                formatted += digitIndex < digits.length ? digits[digitIndex] : "_";
                digitIndex++;
            } else {
                formatted += mask[i];
            }
        }

        return formatted;
    };
    useEffect(() => {
        console.log(phoneNumber);
    }, [phoneNumber]);

    const onDrop = (acceptedFiles) => {
        setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "application/pdf, image/*",
        maxSize: 5 * 1024 * 1024,
        multiple: true,
    });

    const removeFile = (fileName) => {
        setUploadedFiles((prevFiles) =>
            prevFiles.filter((file) => file.name !== fileName)
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "fincode") {
            const uppercaseValue = value.toUpperCase().slice(0, 7);
            setFormData((prevData) => ({
                ...prevData,
                [name]: uppercaseValue,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
        };

        // Debug: log payload for development purposes
        console.log("Submitting form data:", payload);
        console.log(`Number is ${formData.phonenumber}`);


        try {
            // Make POST request to the backendå
            const response = await axios.post("http://127.0.0.1:5000/add", payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.success) {
                // Handle successful registration
                alert("User registered successfully!");

                // Reset form state after successful submission
                setFormData({
                    firstname: "",
                    lastname: "",
                    fathername: "",
                    fincode: "",
                    phonenumber: "",
                    fakulte: "",
                    groupnumber: "",
                    status: "",
                    bilet: "",
                    email: "",
                    registrationDate: "",
                    note: "",
                    document: []
                });

                setPhoneNumber("+994 (__) ___ __ __");
                setUploadedFiles([]);
            } else {
                // Handle failure response
                alert(`Error: ${response.data.message}`);
                console.error("Submission error:", response.data);
            }
        } catch (error) {
            // Log error and show user-friendly message
            console.error("Error during form submission:", error);
            alert("An error occurred while submitting the form. Please try again.");
        }
    };

    const handleFacultyChange = (faculty) => {
        setFormData({
            ...formData,
            fakulte: faculty,
        });
        setFacDropdown(false)
    };
    console.log(formData);
    

    return (
        <main className={styles["faculty-admin-main"]}>
            <FacultyAdminAside facultyName={adminAsideName} />
            <section className={styles["fac-adm-register-section"]}>
                <div className={styles["fac-adm-register-head-txt"]}>
                    <div className={styles["fac-adm-register-digimeal-logo-container"]}>
                        <SchoolIcon style={{ marginRight: 15, fontSize: 40 }} />
                        DigiMeal
                    </div>
                    <p>Yeni istifadəçi profili yaradın</p>
                </div>
                <div className={styles["fac-adm-register-form-container"]}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles["fac-adm-reg-form-name-container"]}>
                            <div className={styles["fac-adm-reg-name-label"]}>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    required
                                />
                                <div className={styles["fac-adm-reg-name-placeholder"]}>Ad</div>
                            </div>
                            <div className={styles["fac-adm-reg-surname-label"]}>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    required
                                />
                                <div className={styles["fac-adm-reg-surname-placeholder"]}>Soy Ad</div>
                            </div>
                            <div className={styles["fac-adm-reg-father-label"]}>
                                <input
                                    type="text"
                                    name="fathername"
                                    value={formData.fathername}
                                    onChange={handleChange}
                                    required
                                />
                                <div className={styles["fac-adm-reg-father-name-placeholder"]}>
                                    Ata Adı
                                </div>
                            </div>
                        </div>
                        <div className={styles["fac-adm-reg-fin-code-label"]}>
                            <input
                                type="text"
                                name="fincode"
                                value={formData.fincode}
                                onChange={handleChange}
                                required
                            />
                            <div className={styles["fac-adm-reg-fin-placeholder"]}>Fin Kod</div>
                        </div>
                        <div className={styles["fac-adm-reg-phone-label"]}>
                            <div className={styles["fac-adm-reg-phone-prefix"]}>
                                <div
                                    className={styles["fac-adm-reg-phone-prefix-head"]}
                                    onClick={handlePrefixDropdown}
                                >
                                    Prefix
                                    <ArrowDropDownIcon
                                        style={
                                            prefixDropdown
                                                ? { rotate: "180deg", transition: "all 400ms" }
                                                : { rotate: "0deg", transition: "all 400ms" }
                                        }
                                    />
                                </div>
                                <div
                                    className={styles["fac-adm-reg-phone-preffix-list"]}
                                    style={prefixDropdown ? { display: "block" } : { display: "none" }}
                                >
                                    <ul>
                                        <li onClick={() => handlePrefix("55")}>55</li>
                                        <li onClick={() => handlePrefix("99")}>99</li>
                                        <li onClick={() => handlePrefix("50")}>50</li>
                                        <li onClick={() => handlePrefix("51")}>51</li>
                                        <li onClick={() => handlePrefix("10")}>10</li>
                                        <li onClick={() => handlePrefix("70")}>70</li>
                                        <li onClick={() => handlePrefix("77")}>77</li>
                                    </ul>
                                </div>
                            </div>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={handlePhoneNumber}
                                required
                            />
                        </div>
                        <div className={styles["fac-adm-reg-faculty-label"]} onClick={handleFacDropdown}>
                            <input
                                type="text"
                                name="fakulte"
                                value={formData.fakulte}
                                required
                                readOnly
                                disabled
                                placeholder="Fakültə"
                            />
                        </div>
                        <div className={styles["fac-adm-reg-group-label"]}>
                            <input
                                type="text"
                                name="groupnumber"
                                value={formData.groupnumber}
                                onChange={handleChange}
                                required
                            />
                            <div className={styles["fac-adm-reg-group-placeholder"]}>Qrup</div>
                        </div>
                        <div className={styles["fac-adm-reg-status-label"]}>
                            <input
                                type="text"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            />
                            <div className={styles["fac-adm-reg-status-placeholder"]}>Status</div>
                        </div>
                        <div className={styles["fac-adm-reg-ticket-label"]}>
                            <input
                                type="text"
                                name="bilet"
                                value={formData.bilet}
                                onChange={handleChange}
                                required
                            />
                            <div className={styles["fac-adm-reg-ticket-placeholder"]}>Bilet</div>
                        </div>
                        <div className={styles["fac-adm-reg-email-label"]}>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <div className={styles["fac-adm-reg-email-placeholder"]}>E-mail</div>
                        </div>
                        <div className={styles["fac-adm-reg-date-label"]}>
                            <input
                                type="text"
                                name="reg-date"
                                value={formData.registrationDate}
                                required
                                disabled
                            />
                        </div>
                        <div className={styles["fac-adm-reg-note-label"]}>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                required
                            />
                            <div className={styles["fac-adm-reg-note-placeholder"]}>Qeyd</div>
                        </div>
                        <div {...getRootProps()} className={styles["fac-adm-dropzone-container"]}>
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p>Faylları bura buraxın...</p>
                            ) : (
                                <p>
                                    Faylları bura sürükləyib buraxın və ya faylları seçmək üçün klikləyin.
                                    <br />
                                    (Qəbul edilən formatlar: PDF, Şəkillər)
                                </p>
                            )}
                            {uploadedFiles.length > 0 && (
                                <div className={styles["fac-adm-reg-uploaded-doc-container"]}>
                                    <h4>Yüklənmiş fayllar:</h4>
                                    <ul className={styles["fac-adm-reg-uploaded-doc-list"]}>
                                        {uploadedFiles.map((file, index) => (
                                            <li key={index}>
                                                {file.name}{" "}
                                                <button
                                                    onClick={() => removeFile(file.name)}
                                                    style={{ marginLeft: "10px" }}
                                                >
                                                    Sil
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <button className={styles["fac-adm-reg-submit-btn"]} type="submit">
                            Qeydiyyat
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}