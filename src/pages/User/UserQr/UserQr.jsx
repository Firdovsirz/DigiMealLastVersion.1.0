import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styles from "../UserQr/UserQr.module.scss";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import Header from "../../../components/Header/Header";
import React, { useState, useEffect, useRef } from 'react';
import QrCodeTest from "../../../assets/UserPage/qr-code-test.png";
import axios from 'axios'; // Import Axios for API requests

export default function UserQr() {
  const { t } = useTranslation();
  const downloadRef = useRef(null);
  const location = useLocation();
  // const { username } = location.state || {}; // Get username from state
  const countDown = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const difference = midnight - now;

    if (difference > 0) {
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { hours, minutes, seconds };
    }

    return { hours: 0, minutes: 0, seconds: 0 };
  };
  const [timeLeft, setTimeLeft] = useState(countDown());
  // const [backendUsername, setBackendUsername] = useState(''); // State for the backend username
  // const [loading, setLoading] = useState(true); // State to show loading status
  const [error, setError] = useState(null); // State for error messages

  const handleDownload = () => {
    if (downloadRef.current) {
      downloadRef.current.click();
    }
  };


  // useEffect(() => {
  //   // Fetch backend username on component mount
  //   if (username) {
  //     axios
  //       .post('http://127.0.0.1:5000/get_username', { username })
  //       .then(response => {
  //         if (response.data.success) {
  //           setBackendUsername(response.data.istifadeci_adi);
  //         } else {
  //           setError(response.data.message);
  //         }
  //       })
  //       .catch(err => setError('Failed to fetch username.'))
  //       .finally(() => setLoading(false));
  //   } else {
  //     setError('No username provided.');
  //     setLoading(false);
  //   }

  //   const timer = setInterval(() => {
  //     setTimeLeft(countDown());
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [username]);

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   return <p>Error: {error}</p>;
  // }

  return (
    <>
      <Header />
      <main className={styles['user-page-main']}>
        <section className={styles['user-page-qr-section']}>
          <div className={styles['user-page-qr-container']}>
            <div className={styles['user-page-qr-img-container']}>
              <img
                src={QrCodeTest}
                alt="qr-code-test"
                className={styles['qr-code-img']} />
            </div>
            {/* Display the username fetched from the backend */}
            <p className={styles['countdown-container']}>
              {timeLeft.hours} saat {timeLeft.minutes} deqiqe {timeLeft.seconds} saniye
            </p>
            {/* anchor for downloading QR code image */}
            <a
              ref={downloadRef}
              href={QrCodeTest}
              download="qr-code-test.jpg"
              style={{ display: "none" }}>
              Hidden Download Link
            </a>
            <button
              onClick={handleDownload}
              className={styles['user-download-qr-btn']}>
              {t('user-download-qr-btn-txt', { ns: 'user' })}
            </button>
          </div>
        </section>
        <section className={styles['user-page-response-bottom-nav-section']}>
          <div className={styles['user-page-bottom-nav-container']}>
            <div className={styles['user-bottom-nav-qr-gen-btn-container']}>
              <div className={styles['bottom-nav-curve-first']} />
              <div className={styles['bottom-nav-curve-second']} />
              <div className={styles['user-bottom-nav-qr-container']}>
                <div className={styles['user-bottom-nav-qr-gen-icon-container']}>
                  <QrCode2Icon style={{ color: '#blue', fontSize: 35 }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}