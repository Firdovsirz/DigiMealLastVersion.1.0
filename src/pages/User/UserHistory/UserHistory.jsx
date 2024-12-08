import React from 'react';
import { useSelector } from 'react-redux';
import Header from "../../../components/Header/Header";
import styles from "../UserHistory/UserHistory.module.scss";

export default function UserHistory() {
  const username = useSelector((state) => state.auth.username)
  // console.log(`username: ${username}`);
  
  return (
    <>
      <Header />
      <main className={styles['user-history-main']}>
      </main>
    </>
  )
}
