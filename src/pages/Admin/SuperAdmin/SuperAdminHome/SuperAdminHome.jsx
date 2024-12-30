import React from 'react';
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import { ResponsiveLine } from '@nivo/line';
import styles from "./SuperAdminHome.module.scss";
import "react-circular-progressbar/dist/styles.css";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SuperAdminAside from "../SuperAdminAside/SuperAdminAside";

export default function SuperAdminHome() {
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
    const lastOperations = [
        {
            name: "Firdovsi",
            surname: "Rzaev",
            date: "2024-3-15",
            amount: 5,
            faculty: "ITT"
        }, {
            name: "Karam",
            surname: "Shukurlu",
            date: "2024-3-15",
            amount: 5,
            faculty: "ITT"
        }, {
            name: "Firdovsi",
            surname: "Rzaev",
            date: "2024-3-15",
            amount: 5,
            faculty: "ITT"
        }, {
            name: "Karam",
            surname: "Shukurlu",
            date: "2024-3-15",
            amount: 5,
            faculty: "ITT"
        }, {
            name: "Firdovsi",
            surname: "Rzaev",
            date: "2024-3-15",
            amount: 5,
            faculty: "ITT"
        }, {
            name: "Karam",
            surname: "Shukurlu",
            date: "2024-3-15",
            amount: 5,
            faculty: "ITT"
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
                                // legends={[
                                //     {
                                //         anchor: "bottom-right",
                                //         direction: "column",
                                //         justify: false,
                                //         translateX: 100,
                                //         translateY: 0,
                                //         itemsSpacing: 0,
                                //         itemDirection: "left-to-right",
                                //         itemWidth: 80,
                                //         itemHeight: 20,
                                //         itemOpacity: 0.75,
                                //         symbolSize: 12,
                                //         symbolShape: "circle",
                                //         symbolBorderColor: "rgba(0, 0, 0, .5)",
                                //         effects: [
                                //             {
                                //                 on: "hover",
                                //                 style: {
                                //                     itemOpacity: 1,
                                //                 },
                                //             },
                                //         ],
                                //     },
                                // ]}
                                // for removing the id text
                                theme={{
                                    textColor: "rgb(109, 197, 168)", // Default text color
                                    fontSize: 12,
                                    axis: {
                                        legend: {
                                            text: {
                                                fill: "rgb(109, 197, 168)", // Axis legend text color
                                            },
                                        },
                                        ticks: {
                                            text: {
                                                fill: "rgb(109, 197, 168)", // Axis tick text color
                                            },
                                        },
                                    },
                                    legends: {
                                        text: {
                                            fill: "rgb(109, 197, 168)", // Legend text color
                                        },
                                    },
                                    tooltip: {
                                        container: {
                                            color: "rgb(109, 197, 168)", // Tooltip text color
                                        },
                                    },
                                    grid: {
                                        line: {
                                            stroke: "rgb(24, 38, 98)", // Grid line color
                                            strokeWidth: 1, // Adjust the thickness of the grid lines
                                        },
                                    },
                                }}
                                enableGridX={true} // Ensure grid lines on X-axis are enabled
                                enableGridY={true}
                            />
                        </div>
                        <div className={styles['sp-adm-last-operation']}>
                            <h3>Sonuncu Əməliyyatlar</h3>
                            <div className={styles['sp-adm-lst-op-container']}>
                                {lastOperations.map((item, index)=>{
                                    return(
                                        <div className={styles['sp-adm-lst-op-item']} key={index}>
                                            <div className={styles['sp-adm-lst-op-item-name']}>
                                                <p>{item.name}</p>
                                                <p>{item.surname}</p>
                                            </div>
                                            <div className={styles['sp-adm-lst-op-item-fact']}>
                                                <p>{item.faculty}</p>
                                            </div>
                                            <div className={styles['sp-adm-lst-op-item-date']}>
                                                <p>{item.date}</p>
                                            </div>
                                            <div className={styles['sp-adm-lst-op-item-amount']}>
                                                <p>{item.amount}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
