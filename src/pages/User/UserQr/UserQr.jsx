import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../UserQr/UserQr.module.scss";
import Header from "../../../components/Header/Header";
import React, { useState, useEffect, useRef } from "react";

export default function UserQr() {
  const { t } = useTranslation();
  const downloadRef = useRef(null);
  const location = useLocation();
  const { username } = location.state || {};
  const displayName = username || "Anonymous";  // Ensure username is not undefined

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [qrCodeImg, setQrCodeImg] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Countdown to midnight
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

  // Fetch QR code status on load
  const fetchQrCodeStatus = () => {
    if (!username) {
      setErrorMessage("Username is required.");
      return;  // Prevent fetching if username is not available
    }

    fetch(`http://127.0.0.1:5000/get_qrs/${username}`)
      .then((response) => response.json())
      .then((data) => {
        const today = new Date().toISOString().split("T")[0];
        const todaysQr = data.find((qr) => qr.date === today && qr.status === 1);

        if (todaysQr) {
          // Show the generated QR code for today
          setQrCodeImg(`data:image/png;base64,${todaysQr.image}`);
          setIsButtonDisabled(true); // Disable button
        } else {
          // If no QR for today, show the most recent QR code
          const latestQr = data.find((qr) => qr.status === 1); // Get the most recent active QR
          if (latestQr) {
            setQrCodeImg(`data:image/png;base64,${latestQr.image}`);
          } else {
            setQrCodeImg(null);
          }
          setIsButtonDisabled(false); // Enable button if no QR for today
        }
      })
      .catch((error) => {
        console.error("Error fetching QR status:", error);
        setErrorMessage("Failed to fetch QR code status.");
      });
  };

  useEffect(() => {
    if (username) {
      fetchQrCodeStatus(); // Fetch QR codes when the username is available
    }
  }, [username]);

  // Generate QR code
  const handleGenerateQR = () => {
    if (!username) {
      setErrorMessage("Username is required.");
      return;  // Prevent generating QR code if username is missing
    }

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
          setQrCodeImg(`data:image/png;base64,${data.image}`);
          setIsButtonDisabled(true);
        } else {
          setErrorMessage(data.message || "Failed to generate QR code.");
        }
      })
      .catch((error) => {
        console.error("Error generating QR code:", error);
        setErrorMessage("An error occurred while generating the QR code.");
      });
  };

  // Handle QR code download
  const handleDownload = () => {
    if (downloadRef.current && qrCodeImg) {
      const a = document.createElement("a");
      a.href = qrCodeImg;
      a.download = `${username}_qr.png`;
      a.click();
    }
  };

  return (
    <>
      <Header />
      <main className={styles["user-page-main"]}>
        <section className={styles["user-page-qr-section"]}>
          <div className={styles["user-page-qr-container"]}>
            <div className={styles["user-page-qr-img-container"]}>
              {qrCodeImg ? (
                <img
                  src={qrCodeImg}
                  alt="Generated QR Code"
                  className={styles["qr-code-img"]}
                />
              ) : (
                <p>{errorMessage || "Click the button to generate a QR code."}</p>
              )}
            </div>
            <p className={styles["countdown-container"]}>
              {timeLeft.hours} saat {timeLeft.minutes} dəqiqə {timeLeft.seconds} saniyə
            </p>
            <button
              onClick={handleGenerateQR}
              className={styles["user-generate-qr-btn"]}
              disabled={isButtonDisabled}
            >
              {isButtonDisabled
                ? "QR Kod Artıq Yaradılıb"
                : "QR Kod Yarat"}
            </button>
            {qrCodeImg && (
              <>
                <a
                  ref={downloadRef}
                  href={qrCodeImg}
                  download={`${username}-qr-code.png`}
                  style={{ display: "none" }}
                >
                  Gizli Yükləmə Linki
                </a>
                <button
                  onClick={handleDownload}
                  className={styles["user-download-qr-btn"]}
                >
                  QR Kod Yüklə
                </button>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}