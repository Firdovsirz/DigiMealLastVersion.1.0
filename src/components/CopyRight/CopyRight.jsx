import React from 'react';
import styles from "../CopyRight/CopyRight.module.scss";
import CopyrightIcon from '@mui/icons-material/Copyright';

export default function CopyRight() {
    return (
        <p className={styles['copyright-txt']}>
            <CopyrightIcon style={{color: "#fff", marginRight: 10}}/>
            Bütün hüquqlar qorunur. AzTu | THİK
        </p>
    )
}
