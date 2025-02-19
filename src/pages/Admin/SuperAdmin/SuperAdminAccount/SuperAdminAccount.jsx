import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import apiClient from "../../../../redux/apiClient";
import styles from "./SuperAdminAccount.module.scss";
import { useSelector, useDispatch } from "react-redux";
import SuperAdminAside from '../SuperAdminAside/SuperAdminAside';
import { clearSuperAdminAuth } from "../../../../redux/superAdminAuthSlice";
import SuperAdminAccountFilter from "../SuperAdminAccountFilter/SuperAdminAccountFilter";

const SuperAdminAccount = () => {
    const [qrCodes, setQrCodes] = useState([]);
    const [filteredQrCodes, setFilteredQrCodes] = useState({});
    const [filter, setFilter] = useState(false);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [week, setWeek] = useState('');

    // Get current year and month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-indexed, so add 1
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.superAdminAuth.token);

    // Fetch QR codes from the backend
    const fetchQrCodes = async () => {
        try {
            const response = await apiClient.get('/get_bufet_account',{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setQrCodes(response.data.data);
            } else {
                console.error('No data found');
            }
        } catch (error) {
            console.error('Error fetching QR codes:', error);
        }
    };

    // Group QR Codes by Bufet and calculate their total prices
    const groupByBufet = (qrCodes) => {
        // Initialize bufet totals for all bufets (even those with no QR codes)
        const bufetTotals = {
            bufet1: 0,
            bufet2: 0,
            bufet3: 0,
            bufet4: 0,
        };

        qrCodes.forEach(qrCode => {
            if (bufetTotals[qrCode.bufet] !== undefined) {
                bufetTotals[qrCode.bufet] += qrCode.qiymet;
            }
        });

        return bufetTotals;
    };

    // Apply filters to the qrCodes data based on year, month, and week
    const filterQrCodes = () => {
        let filtered = qrCodes;

        // Filter by year if selected
        if (year) {
            filtered = filtered.filter(qrCode => {
                const qrCodeYear = qrCode.date.slice(0, 4); // Slice to get the year part (e.g., '2025')
                return qrCodeYear === year;
            });
        }

        // Filter by month if selected
        if (month) {
            filtered = filtered.filter(qrCode => {
                const qrCodeMonth = qrCode.date.slice(5, 7); // Slice to get the month part (e.g., '02' for February)
                return qrCodeMonth === month;
            });
        } else {
            // Set default to current month if no month is selected
            filtered = filtered.filter(qrCode => qrCode.date.slice(5, 7) === currentMonth.toString().padStart(2, '0'));
        }

        // Filter by week if selected
        if (week) {
            filtered = filtered.filter(qrCode => {
                const date = new Date(qrCode.date);
                const qrCodeWeek = getWeekNumber(date);
                return qrCodeWeek === parseInt(week);
            });
        }

        // Now group by bufet and get the total price for each bufet
        const groupedByBufet = groupByBufet(filtered);
        setFilteredQrCodes(groupedByBufet);
    };

    // Get the week number from a given date
    const getWeekNumber = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    };

    // When qrCodes, year, month, or week changes, apply the filter
    useEffect(() => {
        const checkTokenExpiration = () => {
            if (!token) {
                // If there's no token, navigate to the login page
                navigate("/super-admin-login", { replace: true });
                return;
            }

            try {
                // Decode the token
                const decodedToken = JSON.parse(atob(token.split('.')[1]));

                // Get expiration time
                const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds

                // Get the current time
                const currentTime = Date.now();

                // Check if the token is expired
                if (currentTime >= expirationTime) {
                    // Token has expired, clear the authentication data in Redux
                    dispatch(clearSuperAdminAuth());

                    // Optionally, clear the token from localStorage (if still storing it there)
                    localStorage.removeItem('authToken');

                    // Redirect to login page
                    navigate("/super-admin-login", { replace: true });
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                dispatch(clearSuperAdminAuth()); // Clear auth state if token is invalid or any error occurs
                navigate("/super-admin-login", { replace: true });
            }
        };

        // Call the expiration check
        checkTokenExpiration();
        fetchQrCodes();
    }, []); // Fetch QR codes only once on mount

    // Whenever qrCodes, year, month, or week changes, apply the filter
    useEffect(() => {
        if (qrCodes.length > 0) {
            // By default, filter for current month if no month is selected
            if (!month) {
                setMonth(currentMonth.toString().padStart(2, '0'));
            }
            filterQrCodes();
        }
    }, [year, month, week, qrCodes]);

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    const handleWeekChange = (e) => {
        setWeek(e.target.value);
    };

    const handleFilter = () => {
        setFilter(!filter);
    };
    const [firstKorpusPrice, setFirstKorpusPrice] = useState(0);
    const [secondKorpusPrice, setSecondKorpusPrice] = useState(0);
    const [thirdKorpusPrice, setThirdKorpusPrice] = useState(0);
    const [fourthKorpusPrice, setFourthKorpusPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Calculate the price of Korpus1 whenever qrCodes change
        const price1 = qrCodes.filter(item => item.bufet === 'Korpus 1');
        const totalPrice1 = price1.reduce((acc, item) => acc + item.qiymet, 0);
        setFirstKorpusPrice(totalPrice1);
    }, [qrCodes]);

    useEffect(() => {
        // Calculate the price of Korpus1 whenever qrCodes change
        const price2 = qrCodes.filter(item => item.bufet === 'Korpus 2');
        const totalPrice2 = price2.reduce((acc, item) => acc + item.qiymet, 0);
        setSecondKorpusPrice(totalPrice2);
    }, [qrCodes]);
    useEffect(() => {
        // Calculate the price of Korpus1 whenever qrCodes change
        const price3 = qrCodes.filter(item => item.bufet === 'Korpus 3');
        const totalPrice3 = price3.reduce((acc, item) => acc + item.qiymet, 0);
        setThirdKorpusPrice(totalPrice3);
    }, [qrCodes]);
    useEffect(() => {
        // Calculate the price of Korpus1 whenever qrCodes change
        const price4 = qrCodes.filter(item => item.bufet === 'Korpus 4');
        const totalPrice4 = price4.reduce((acc, item) => acc + item.qiymet, 0);
        setFourthKorpusPrice(totalPrice4);
    }, [qrCodes]);
    useEffect(() => {
        const totalPrice = firstKorpusPrice + secondKorpusPrice + thirdKorpusPrice + fourthKorpusPrice;
        setTotalPrice(totalPrice);
    }, [firstKorpusPrice, secondKorpusPrice, thirdKorpusPrice, fourthKorpusPrice])
    return (
        <>
            <main className={styles['sp-adm-account-main']}>
                <SuperAdminAside />
                <section className={styles['sp-adm-account-section']}>
                    <h1>Hesabat</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Bufet adı</th>
                                <th>Qiymət</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Korpus 1</td>
                                <td>{firstKorpusPrice}</td>
                            </tr>
                            <tr>
                                <td>Korpus 2</td>
                                <td>{secondKorpusPrice}</td>
                            </tr>
                            <tr>
                                <td>Korpus 3</td>
                                <td>{thirdKorpusPrice}</td>
                            </tr>
                            <tr>
                                <td>Korpus 4</td>
                                <td>{fourthKorpusPrice}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Yekun Qiymət</th>
                                <th>{totalPrice}</th>
                            </tr>
                        </tfoot>
                    </table>
                </section>
            </main>
            <SuperAdminAccountFilter
                accountFilter={filter}
                setAccountFilter={setFilter}
                toggleFilter={handleFilter}
                setYear={setYear}
                setMonth={setMonth}
                setWeek={setWeek}
            />
        </>
    );
};

export default SuperAdminAccount;
