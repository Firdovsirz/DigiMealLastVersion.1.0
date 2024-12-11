import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from "../../../components/Header/Header";
import styles from "../UserHistory/UserHistory.module.scss";
import { useTranslation } from 'react-i18next';

export default function UserHistory() {
  const { t } = useTranslation();
  const username = useSelector((state) => state.auth.username);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      fetch(`http://127.0.0.1:5000/user/history/${username}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch history data');
          }
          return response.json();
        })
        .then((data) => {
          setHistoryData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching history data:", error);
          setLoading(false);
        });
    }
  }, [username]);

  // if (loading) {
  //   return (
  //     <>
  //       <Header />
  //       <main className={styles['user-history-main']}>
  //         <p>Loading history...</p>
  //       </main>
  //     </>
  //   );
  // }

  return (
    <>
      <Header />
      <main className={styles['user-history-main']}>
        <div className={styles['user-history-head-txt-container']}>
          <h2>{t('user-history-heading', { ns: 'user' })}</h2>
        </div>
        {historyData.length > 0 ? (
          <div className={styles['history-table-wrapper']}>
            <table className={styles['history-table']}>
              <thead className={styles['history-table-head']}>
                <tr>
                  <th>Qr Id</th>
                  <th>Date</th>
                  <th>Status Scanner</th>
                </tr>
              </thead>
              <tbody className={styles['history-table-body']}>
                {historyData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.date}</td>
                    <td>{item.status_scanner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No history found for the user.</p>
        )}
      </main>
    </>
  );
}
