import React from 'react';
import styles from "./ScannerHistory.module.scss";
import ScannerHeader from '../../../components/Header/ScannerHeader/ScannerHeader';
import ScannerBottomNavigation from '../../../components/BottomNavigation/ScannerBottomNavigation/ScannerBottomNavigation';

export default function ScannerHistory() {
    return (
        <>
            <ScannerHeader />
            <main className={styles['sc-history-main']}>
                <h1>Tarixçə</h1>
                <section className={styles['sc-history-table-container']}>
                    <table>
                        <thead>
                            <tr>
                                <th>Qr Kod ID</th>
                                <th>Tarix</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>95b19316-a531-4dc2-bab4-587af1609860</td>
                                <td>2025-01-08</td>
                            </tr>
                            <tr>
                                <td>95b19316-a531-4dc2-bab4-587af1609860</td>
                                <td>2025-01-08</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </main>
            <ScannerBottomNavigation />
        </>
    )
}
