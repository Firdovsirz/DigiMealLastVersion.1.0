import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../UserQr/UserQr.module.scss";
import { setUsername } from "../../../redux/authSlice";
import Header from "../../../components/Header/Header";
import React, { useState, useEffect, useRef } from "react";
import BottomNavigation from "../../../components/BottomNavigation/BottomNavigation";

export default function UserQr() {
  const { t } = useTranslation();
  const downloadRef = useRef(null);
  const location = useLocation();
  const username = useSelector((state) => state.auth.username);
  const displayName = username || "Anonymous";

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

  // Fetch today's QR code using the get_qrs route
  useEffect(() => {
    const fetchQrCodes = async () => {
      if (!username) {
        setErrorMessage("Username is required.");
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:5000/user/get_qrs/${username}`);
        const data = await response.json();

        if (data && data.length > 0) {
          const today = new Date().toISOString().split("T")[0];
          const todaysQr = data.find((qr) => qr.date === today && qr.status === 1);

          if (todaysQr) {
            setQrCodeImg(`data:image/png;base64,${todaysQr.image}`);
            setIsButtonDisabled(true); // Disable the button if QR code exists
          } else {
            setQrCodeImg(null);
            setIsButtonDisabled(false); // Allow user to generate QR
          }
        } else {
          setErrorMessage("No QR code history found.");
          setIsButtonDisabled(false);
        }
      } catch (error) {
        console.error("Error fetching QR codes:", error);
        setErrorMessage("Failed to fetch QR codes.");
      }
    };

    fetchQrCodes();
  }, [username]);

  // Handle Generate QR Code
  const handleGenerateQR = async () => {
    if (!username) {
      setErrorMessage("Username is required.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/user/generate_qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (data.success) {
        setQrCodeImg(`data:image/png;base64,${data.image}`);
        setIsButtonDisabled(true); // Disable the button after generating
      } else {
        setErrorMessage(data.message || "Failed to generate QR code.");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      setErrorMessage("An error occurred while generating the QR code.");
    }
  };

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
              {timeLeft.hours} {t("user-qr-hour", { ns: "user" })}
              {timeLeft.minutes} {t("user-qr-minute", { ns: "user" })}
              {timeLeft.seconds} {t("user-qr-second", { ns: "user" })}
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
                  {t("user-download-qr-btn-txt", { ns: "user" })}
                </button>
              </>
            )}
          </div>
        </section>
        {window.innerWidth < 600 ? <BottomNavigation /> : null}
      </main>
    </>
  );
}
