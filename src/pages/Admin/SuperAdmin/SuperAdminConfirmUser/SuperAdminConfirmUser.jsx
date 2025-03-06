import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect } from 'react';
import apiClient from '../../../../redux/apiClient';
import styles from "./SuperAdminConfirmUser.module.scss";

export default function SuperAdminConfirmUser({ confirmUser, setConfirmUser, email, object }) {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.superAdminAuth.token);

  const handleClose = () => {
    setConfirmUser(false);
    setOtp('');
    setErrorMessage('');
    setSuccessMessage('');
    setIsOtpRequested(false);
  };

  useEffect(() => {
    if (confirmUser && !isOtpRequested) {
      requestOtp(email);
    }
  }, [confirmUser, isOtpRequested]);

  const requestOtp = async (email) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post(`/request-and-send-otp/${email}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(response);
    
      if (response.status === 200) {
        setSuccessMessage('OTP has been sent successfully!');
        setErrorMessage('');
        setIsOtpRequested(true);
      } else {
        setErrorMessage('Failed to send OTP. Please try again.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp || !email) {
      setErrorMessage('Please fill out all fields.');
      setSuccessMessage('');
      return;
    }

    // Parse OTP as an integer
    const otpInt = parseInt(otp, 10);

    if (isNaN(otpInt)) {
      setErrorMessage('OTP must be a valid number.');
      setSuccessMessage('');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.post(
        `/verify-otp/${email}`, // Send email in URL path
        { otp: otpInt }, // Send OTP as an integer
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setSuccessMessage('OTP verified successfully!');
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to verify OTP.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {confirmUser ? (
        <div className={styles['sp-adm-confirm-user-container']}>
          <div className={styles['sp-adm-confirm-user-form-container']}>
            <CloseIcon
              className={styles['sp-adm-confirm-close-icon']}
              onClick={handleClose}
            />
            <h2>OTP Verification</h2>
            {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
            {successMessage && <p className={styles['success-message']}>{successMessage}</p>}
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <input
                  type="text"
                  required
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button type="submit">Verify</button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}