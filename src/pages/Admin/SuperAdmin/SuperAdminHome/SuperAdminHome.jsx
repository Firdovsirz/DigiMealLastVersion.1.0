import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ResponsiveLine } from '@nivo/line';
import { useNavigate } from "react-router-dom";
import styles from "./SuperAdminHome.module.scss";
import React, { useState, useEffect } from 'react';
import apiClient from '../../../../redux/apiClient';
import "react-circular-progressbar/dist/styles.css";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SuperAdminAside from "../SuperAdminAside/SuperAdminAside";
import { clearSuperAdminAuth } from "../../../../redux/superAdminAuthSlice";

export default function SuperAdminHome() {
    // State to store the last 5 QR code data
    const [lastOperations, setLastOperations] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.superAdminAuth.token);
    // Fetch data from the Flask API using apiClient when the component mounts
    useEffect(() => {
        // Function to check token expiration
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

        // Function to fetch data
        const fetchData = async () => {
            try {
                const response = await apiClient.get('/get_last_5_qr_codes',{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLastOperations(response.data); // Update state with fetched data
            } catch (error) {
                console.error("Error fetching the data:", error);
            }
        };

        // Fetch data after token validation
        if (token) {
            fetchData();
        }

    }, [dispatch, navigate, token]);
    console.log(lastOperations);


    const data = [
        {
            id: "Series 1",
            data: [
                { x: "Yanvar", y: 120 },
                { x: "Fevral", y: 90 },
                { x: "Mart", y: 50 },
                { x: "Aprel", y: 80 },
                { x: "May", y: 30 },
                { x: "Iyun", y: 150 },
                { x: "Iyul", y: 40 },
                { x: "Avqust", y: 85 },
                { x: "Sentyabr", y: 190 },
                { x: "Oktyabr", y: 65 },
                { x: "Noyabr", y: 80 },
                { x: "Dekabr", y: 30 }
            ],
        }
    ];

    return (
        <>
            <main className={styles['super-admin-home-main']}>
                <SuperAdminAside />
                <div className={styles['super-admin-home-main-container']}>
                    <div className={styles['sp-adm-home-head-txt']}>
                        <h1>Dashboard</h1>
                        <p>Admin Panelə xoş gəlmisiniz!</p>
                    </div>
                    <div className={styles['sp-adm-home-short-info-container']}>
                        <div className={styles['sp-adm-home-new-cust']}>
                            <div className={styles['sp-adm-new-cust-txt']}>
                                <PersonAddIcon className={styles['sp-adm-short-info-icon']} />
                                <p className={styles['sp-adm-short-info-amount']}>{`123`}</p>
                                <p className={styles['sp-adm-short-info-detail-txt']}>Yeni istifadəçi</p>
                            </div>
                            <div className={styles['sp-adm-new-cust-chart-container']}>
                                <div className={styles['sp-admin-short-info-chart-container']}>
                                    <CircularProgressbar
                                        value={25}
                                        text={`${25}%`}
                                        strokeWidth={5}
                                    />
                                </div>
                                <p>{`+${`25`}%`}</p>
                            </div>
                        </div>
                        <div className={styles['sp-adm-daily-usage']}>
                            <div className={styles['sp-adm-daily-usage-txt']}>
                                <AttachMoneyIcon className={styles['sp-adm-short-info-icon']} />
                                <p className={styles['sp-adm-short-info-amount']}>{`123`}</p>
                                <p className={styles['sp-adm-short-info-detail-txt']}>Günlük istifadə</p>
                            </div>
                            <div className={styles['sp-adm-daily-usage-chart-container']}>
                                <div className={styles['sp-admin-short-info-chart-container']}>
                                    <CircularProgressbar
                                        value={40}
                                        text={`${40}%`}
                                        strokeWidth={5}
                                    />
                                </div>
                                <p>{`+${`35`}%`}</p>
                            </div>
                        </div>
                        <div className={styles['sp-adm-removed-user']}>
                            <div className={styles['sp-adm-removed-user-txt']}>
                                <PersonRemoveIcon className={styles['sp-adm-short-info-icon']} />
                                <p className={styles['sp-adm-short-info-amount']}>{`123`}</p>
                                <p className={styles['sp-adm-short-info-detail-txt']}>Silinən istifadəçilər</p>
                            </div>
                            <div className={styles['sp-adm-removed-user-chart-container']}>
                                <div className={styles['sp-admin-short-info-chart-container']}>
                                    <CircularProgressbar
                                        value={60}
                                        text={`${60}%`}
                                        strokeWidth={5}
                                    />
                                </div>
                                <p>{`+${`35`}%`}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles['sp-adm-home-graph-last-op']}>
                        <div className={styles['sp-adm-home-graph-container']} style={{ width: "70%", height: "400px" }}>
                            <ResponsiveLine
                                data={data}
                                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                                xScale={{ type: "point" }}
                                yScale={{
                                    type: "linear",
                                    min: "auto",
                                    max: "auto",
                                    stacked: true,
                                    reverse: false,
                                }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    orient: "bottom",
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legend: "Ay",
                                    legendOffset: 36,
                                    legendPosition: "middle",
                                }}
                                axisLeft={{
                                    orient: "left",
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legend: "Məbləğ",
                                    legendOffset: -40,
                                    legendPosition: "middle",
                                }}
                                colors={{ scheme: "nivo" }}
                                pointSize={10}
                                pointColor={{ theme: "background" }}
                                pointBorderWidth={2}
                                pointBorderColor={{ from: "serieColor" }}
                                pointLabelYOffset={-12}
                                useMesh={true}
                                theme={{
                                    textColor: "rgb(109, 197, 168)",
                                    fontSize: 12,
                                    axis: {
                                        legend: {
                                            text: {
                                                fill: "rgb(109, 197, 168)",
                                            },
                                        },
                                        ticks: {
                                            text: {
                                                fill: "rgb(109, 197, 168)",
                                            },
                                        },
                                    },
                                    legends: {
                                        text: {
                                            fill: "rgb(109, 197, 168)",
                                        },
                                    },
                                    tooltip: {
                                        container: {
                                            color: "rgb(109, 197, 168)",
                                        },
                                    },
                                    grid: {
                                        line: {
                                            stroke: "rgb(24, 38, 98)",
                                            strokeWidth: 1,
                                        },
                                    },
                                }}
                                enableGridX={true}
                                enableGridY={true}
                            />
                        </div>
                        <div className={styles['sp-adm-last-operation']}>
                            <h3>Sonuncu Əməliyyatlar</h3>
                            <div className={styles['sp-adm-lst-op-container']}>
                                {lastOperations.map((item, index) => {
                                    return (
                                        <div className={styles['sp-adm-lst-op-item']} key={index}>
                                            <div className={styles['sp-adm-lst-op-item-name']}>
                                                <p>{item.username}</p>
                                            </div>
                                            <div className={styles['sp-adm-lst-op-item-fact']}>
                                                <p>{item.date}</p>
                                            </div>
                                            <div className={styles['sp-adm-lst-op-item-amount']}>
                                                <p>{item.qiymet}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
