import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import apiClient from "../../../redux/apiClient";
import styles from "../UserQr/UserQr.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../../../components/Header/Header";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNavigation from "../../../components/BottomNavigation/BottomNavigation";

export default function UserQr() {
  const { t } = useTranslation();
  const downloadRef = useRef(null);
  const location = useLocation();
  const username = useSelector((state) => state.auth.username);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token.token);
  const displayName = username || "Anonymous";

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [qrCodeImg, setQrCodeImg] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;

      if (diff > 0) {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };
    calculateTimeLeft();
    const intervalId = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(intervalId);
  }, []);

   // Load QR code from localStorage or backend on mount
   const getHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  // Load QR code from backend on mount
  useEffect(() => {
    const fetchQrCode = async () => {
      if (!username || !token) {
        setErrorMessage(t("auth-required"));
        navigate("/", { replace: true });
        return;
      }

      try {
        const response = await apiClient.get(`/user/get_qrs/${username}`, {
          headers: getHeaders(),
        });

        const data = response.data;

        // Find today's QR code
        const today = new Date().toISOString().split("T")[0];
        const todaysQr = data.find((qr) => qr.date === today && qr.status === 1);

        if (todaysQr) {
          setQrCodeImg(`data:image/png;base64,${todaysQr.image}`);
          setIsButtonDisabled(true);
        } else {
          setQrCodeImg(null);
          setIsButtonDisabled(false);
        }
      } catch (error) {
        console.error("Error fetching QR codes:", error);
        setErrorMessage(t("fetch-error"));
      }
    };

    fetchQrCode();
  }, [username, token, navigate, t]);


  const handleGenerateQR = async () => {
    if (!username) {
      setErrorMessage(t("username-required"));
      return;
    }

    if (!token) {
      setErrorMessage(t("auth-required"));
      return;
    }

    try {
      const response = await apiClient.post(
        "/user/generate_qr",
        { username },
        { headers: getHeaders() }
      );

      const data = response.data;

      if (data.success) {
        setQrCodeImg(`data:image/png;base64,${data.image}`);
        setIsButtonDisabled(true);
      } else {
        setErrorMessage(data.message || t("generate-error"));
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      setErrorMessage(t("generate-error"));
    }
  };

  const handleDownload = () => {
    if (qrCodeImg) {
      try {
        if (!qrCodeImg.startsWith("data:image/png;base64,")) {
          setErrorMessage("Invalid QR code format.");
          return;
        }
        const base64Data = qrCodeImg.replace("data:image/png;base64,", "");
        const byteCharacters = atob(base64Data);
        const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${username || "anonymous"}_qr.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to download QR code:", error);
        setErrorMessage("An error occurred while downloading the QR code.");
      }
    } else {
      setErrorMessage("No QR code available to download.");
    }
  };

  useEffect(() => {
    window.history.replaceState(null, "", location.pathname);
  }, [location]);
  

  return (
    <>
      <Header />
      <main className={styles["user-page-main"]}>
        <section className={styles["user-page-qr-section"]}>
          <div className={styles["user-page-qr-container"]}>
            {/* QR Code display and error handling */}
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
            {isButtonDisabled ? <div className={styles["countdown-timer"]}>
              <div className={styles['countdown-hour']}>
                <p className={styles['countdown-hour-int']}>
                  {timeLeft.hours.toString().padStart(2, "0")}
                </p>
                <p className={styles['countdown-hour-txt']}>{t('user-qr-hour', { ns: 'user' })}</p>
              </div>
              <div className={styles['countdown-minute']}>
                <p className={styles['countdown-minute-int']}>
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </p>
                <p className={styles['countdown-minute-txt']}>{t('user-qr-minute', { ns: 'user' })}</p>
              </div>
              <div className={styles['countdown-second']}>
                <p className={styles['countdown-second-int']}>
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </p>
                <p className={styles['countdown-second-txt']}>{t('user-qr-second', { ns: 'user' })}</p>
              </div>
            </div> : null}
            {!isButtonDisabled ? <button
              onClick={handleGenerateQR}
              className={styles["user-generate-qr-btn"]}
              disabled={isButtonDisabled}
            >
              Qr Kod Yarat
            </button> : null}
            {qrCodeImg && (
              <button
                onClick={handleDownload}
                className={styles["user-download-qr-btn"]}
              >
                {t("user-download-qr-btn-txt", { ns: "user" })}
              </button>
            )}
          </div>
        </section>
        {/* {window.innerWidth < 600 ? <BottomNavigation /> : null} */}
        <BottomNavigation />
      </main>
    </>
  );
}