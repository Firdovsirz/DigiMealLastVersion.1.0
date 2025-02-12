import React from 'react';
import { useDispatch } from 'react-redux';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import styles from "./ScannerBottomNavigation.module.scss";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { clearScannerToken } from '../../../redux/scannerAuthSlice';

export default function ScannerBottomNavigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearScannerToken());
        navigate('/scanner-login');
    };

    return (
        <div className={styles['scanner-bottom-nav']}>
            <div className={styles['scanner-bottom-nav-container']}>
                <div className={styles['sc-btm-nav-home']}>
                    <Link to={'/scanner-home'}>
                        <HomeIcon 
                            className={styles['sc-btm-nav-icon']}
                            style={location.pathname === '/scanner-home' ? 
                                { color: 'rgb(24, 38, 98)' } : null} 
                        />
                    </Link>
                </div>
                <div className={styles['sc-btm-nav-log-out']}>
                    <LogoutIcon 
                        className={styles['sc-btm-nav-icon']} 
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            </div>
        </div>
    );
}
