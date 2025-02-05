import { motion } from "framer-motion";
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import apiClient from '../../../redux/apiClient';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import Header from "../../../components/Header/Header";
import styles from "../UserHistory/UserHistory.module.scss";
import BottomNavigation from "../../../components/BottomNavigation/BottomNavigation";

export default function UserHistory() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;
  const token = useSelector((state) => state.token.token);
  const username = useSelector((state) => state.auth.username);

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!token) {
        navigate("/", { replace: true });
        return;
      }
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();
      if (currentTime >= expirationTime) {
        localStorage.removeItem("authToken");
        navigate("/", { replace: true });
      }
    };
    checkTokenExpiration();

    const fetchHistoryData = async () => {
      if (!username) return;

      try {
        const response = await apiClient.get(`/user/history/${username}`);
        setHistoryData(response.data);
      } catch (error) {
        console.error("Error fetching history data:", error);
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [username, token, navigate]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const paginatedData = historyData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const paginationCount = Math.ceil(historyData.length / rowsPerPage);

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles['user-history-main']}>
          <p>Loading history...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <motion.main
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3 }}
        className={styles['user-history-main']}>
        <section className={styles['user-history-head-txt-container']}>
          <h2>{t('user-history-heading', { ns: 'user' })}</h2>
        </section>
        {historyData.length > 0 ? (
          <motion.section
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className={styles['history-table-wrapper']}>
            <table className={styles['history-table']}>
              <thead className={styles['history-table-head']}>
                <tr>
                  <th>Qr Id</th>
                  <th>Date</th>
                  <th>Status Scanner</th>
                </tr>
              </thead>
              <tbody className={styles['history-table-body']}>
                {paginatedData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.date}</td>
                    <td>{item.status_scanner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.section>
        ) : (
          <p>No history found for the user.</p>
        )}
        <section className={styles['user-history-pagination-container']}>
          <Stack spacing={2} className={styles['pagination-component']}>
            <Pagination
              count={paginationCount}
              page={currentPage}
              onChange={handlePageChange}
            />
          </Stack>
        </section>
      </motion.main>
      {window.innerWidth < 600 ? <BottomNavigation isButtonDisabled={true} /> : null}
    </>
  );
}