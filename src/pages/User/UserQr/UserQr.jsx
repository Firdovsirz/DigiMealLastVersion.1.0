import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../../redux/apiClient";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../UserQr/UserQr.module.scss";
import Header from "../../../components/Header/Header";
import React, { useState, useEffect, useRef } from "react";
import BottomNavigation from "../../../components/BottomNavigation/BottomNavigation";

export default function UserQr() {
  const { t } = useTranslation();
  const downloadRef = useRef(null);
  const location = useLocation();
  const username = useSelector((state) => state.auth.username);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token.token); // Get JWT token from Redux
  const displayName = username || "Anonymous";

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [qrCodeImg, setQrCodeImg] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Check token expiration on page load
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!token) {
        navigate("/", { replace: true }); // Redirect without refresh
        return;
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
      const currentTime = Date.now();

      if (currentTime >= expirationTime) {
        localStorage.removeItem("authToken");
        navigate("/", { replace: true }); // Redirect without refresh
      }
    };

    checkTokenExpiration();

    const fetchQrCodes = async () => {
      if (!username) {
        setErrorMessage("Username is required.");
        return;
      }

      try {
        const response = await apiClient.get(`/user/get_qrs/${username}`);
        const data = response.data;

        if (data && data.length > 0) {
          const today = new Date().toISOString().split("T")[0];
          const todaysQr = data.find((qr) => qr.date === today && qr.status === 1);

          if (todaysQr) {
            setQrCodeImg(`data:image/png;base64,${todaysQr.image}`);
            setIsButtonDisabled(true);
          } else {
            setQrCodeImg(null);
            setIsButtonDisabled(false);
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

    if (token) fetchQrCodes();
  }, [username, token, navigate]);

  const handleGenerateQR = async () => {
    if (!username) {
      setErrorMessage("Username is required.");
      return;
    }

    try {
      const response = await apiClient.post("/user/generate_qr", { username });
      const data = response.data;

      if (data.success) {
        setQrCodeImg(`data:image/png;base64,${data.image}`);
        setIsButtonDisabled(true);
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/', { replace: true }); // Redirect to login page without refresh
  };

  // Prevent back navigation by replacing the current history entry
  useEffect(() => {
    window.history.replaceState(null, '', location.pathname);
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
            <p onClick={handleLogout}>log out</p>
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
              <button
                onClick={handleDownload}
                className={styles["user-download-qr-btn"]}
              >
                {t("user-download-qr-btn-txt", { ns: "user" })}
              </button>
            )}
          </div>
        </section>
        {window.innerWidth < 600 ? <BottomNavigation /> : null}
      </main>
    </>
  );
}