import React, { useState, useEffect } from 'react';
import apiClient from '../../../../redux/apiClient';

export default function SuperAdminAllUsersAccountDisplay({ username, month }) {
    const [qrCodeData, setQrCodeData] = useState(null);

    const fetchQRCodeData = async () => {
        try {
            const response = await apiClient.get(`/get_qr_code_by_username`, {
                params: {
                    username,
                    month,
                },
            });

            if (response.data.success) {
                setQrCodeData(response.data.total_qiymet);
            } else {
                setQrCodeData(0);
            }
        } catch (err) {
            console.error(err);
            setQrCodeData(0);
        }
    };

    useEffect(() => {
        if (username && month) {
            fetchQRCodeData();
        }
    }, [username, month]);

    return (
        <div>
            {qrCodeData !== null ? (
                <p>{qrCodeData}</p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
