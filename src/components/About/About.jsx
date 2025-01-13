import React from 'react';
import Header from '../Header/Header';
import styles from "./About.module.scss";
import { useTranslation } from 'react-i18next';
import { BottomNavigation } from '@mui/material';
import Aztu from "../../assets/AboutPage/aztu.jpg";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import Developer from "../../assets/AboutPage/developer.jpg";

export default function About() {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <main className={styles['about-main']}>
        <section className={styles['about-head-section']}>
          <div className={styles['about-head-txt-container']}>
            <div className={styles['about-head-txt']}>
              <h1>Learn About DigiMeal</h1>
              <p>DigiMeal is a free webpage for student that can get free food from university cafeteria.</p>
            </div>
            <div className={styles['about-head-buttons']}>
              <button>Contact With Us</button>
              <button>What is DigiMeal?</button>
            </div>
          </div>
        </section>
        <section className={styles['about-video-section']}>
          <div className={styles['about-video-container']}>
            <iframe
              src="https://www.youtube.com/embed/vS_5SSULAic?si=4Sly0O0iFyBqhBhm"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="YouTube video"
              className={styles['about-video']}
            ></iframe>
          </div>
        </section>
        <section className={styles['about-digimeal-section']}>
          <div className={styles['about-digimeal-img-container']}>
            <img src={Aztu} alt="aztu" />
          </div>
          <div className={styles['about-digimeal-txt-container']}>
            <div className={styles['about-digimeal-head']}>
              <div className={styles['about-digimeal-breath-dot-container']}>
                <div className={styles['about-digimeal-breath-dot']}></div>
              </div>
              <h2>About DigiMeal</h2>
            </div>
            <h2>DigiMeal is a free platform for student that get social assistance in <span>Azerbaijan Technical University.</span></h2>
            <h3>What DigiMeal gives?</h3>
            <p>DigiMeal gives daily food with the 5 azn or more price for the students that gets social assistance.</p>
            <p>100+ Students use this opportunity.</p>
          </div>
        </section>
        <section className={styles['about-our-team-section']}>
          <h2>Meet the Team that makes this projects happens.</h2>
          <div className={styles['about-our-team-container']}>
            <div className={styles['about-our-team-front-end']}>
              <div className={styles['about-our-team-front-contact']}>
                <div className={styles['about-front-name-details']}>
                  <h3>Firdovsi Rzaev</h3>
                  <p>Frontend Developer</p>
                </div>
                <div className={styles['about-front-social-media']}>
                  <div className={styles['about-front-linkedin']}>
                    <LinkedInIcon />
                  </div>
                  <div className={styles['about-front-telegram']}>
                    <TelegramIcon />
                  </div>
                  <div className={styles['about-front-instagram']}>
                    <InstagramIcon />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles['about-our-team-back-end']}>
              <div className={styles['about-our-team-back-contact']}>
                <div className={styles['about-back-name-details']}>
                  <h3>Kerem Shukurlu</h3>
                  <p>Backend Developer</p>
                </div>
                <div className={styles['about-front-social-media']}>
                  <div className={styles['about-front-linkedin']}>
                    <LinkedInIcon />
                  </div>
                  <div className={styles['about-front-telegram']}>
                    <TelegramIcon />
                  </div>
                  <div className={styles['about-front-instagram']}>
                    <InstagramIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {window.innerWidth < 600 ? <BottomNavigation /> : null}
    </>
  )
}
