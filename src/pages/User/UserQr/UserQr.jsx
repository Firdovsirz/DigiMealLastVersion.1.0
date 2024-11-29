import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from "../UserQr/UserQr.module.scss";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import Header from "../../../components/Header/Header";
import React, { useState, useEffect, useRef } from 'react';

export default function UserQr() {
  const { t } = useTranslation();
  const downloadRef = useRef(null);
  const location = useLocation();
  const { username } = location.state || {};
  const displayName = username || "Anonymous";

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [qrCodeImg, setQrCodeImg] = useState(null);
  const [qrCodeDate, setQrCodeDate] = useState(null); // State to store the QR code's date
  const [errorMessage, setErrorMessage] = useState("");

  // Countdown logic
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(countDown());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch QR code from the Flask API
  useEffect(() => {
    if (username) {
      fetch("http://127.0.0.1:5000/generate_qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const currentDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
            setQrCodeDate(data.date); // Assuming the backend sends the date the QR code was generated
            if (data.date === currentDate) {
              setQrCodeImg(`data:image/png;base64,${data.image}`);
            } else {
              setErrorMessage("QR code is not valid for today.");
            }
          } else {
            setErrorMessage(data.message || "Failed to generate QR code.");
          }
        })
        .catch((error) => {
          setErrorMessage("An error occurred while generating the QR code.");
          console.error(error);
        });
    }
  }, [username]);

  const handleDownload = () => {
    if (downloadRef.current) {
      downloadRef.current.click();
    }
  };

  return (
    <>
      <Header />
      <main className={styles['user-page-main']}>
        <section className={styles['user-page-qr-section']}>
          <div className={styles['user-page-qr-container']}>
            <div className={styles['user-page-qr-img-container']}>
              {qrCodeImg ? (
                <img
                  src={qrCodeImg}
                  alt="Generated QR Code"
                  className={styles['qr-code-img']}
                />
              ) : (
                <p>{errorMessage || "QR code is loading..."}</p>
              )}
            </div>
            <p className={styles['countdown-container']}>
              {timeLeft.hours} saat {timeLeft.minutes} dəqiqə {timeLeft.seconds} saniyə
            </p>
            {qrCodeImg && (
              <>
                <a
                  ref={downloadRef}
                  href={qrCodeImg}
                  download={`${username}-qr-code.png`}
                  style={{ display: "none" }}
                >
                  Hidden Download Link
                </a>
                <button
                  onClick={handleDownload}
                  className={styles['user-download-qr-btn']}
                >
                  {t('user-download-qr-btn-txt', { ns: 'user' })}
                </button>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}