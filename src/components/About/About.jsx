import React from 'react';
import styles from "./About.module.scss";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import AztuLogo from "../../assets/LoginPage/aztu-logo.png";
import ThikLogo from "../../assets/LoginPage/thik-logo.png";
import ProfileImg from "../../assets/AboutPage/profile-image.webp";
import DeveloperImageTest from "../../assets/LoginPage/developer-image-test.jpg";

export default function About() {
    const socialIcons = [
        <WhatsAppIcon className={styles['dev-social-icon']} />,
        <TelegramIcon className={styles['dev-social-icon']} />,
        <GitHubIcon className={styles['dev-social-icon']} />,
        <LinkedInIcon className={styles['dev-social-icon']} />
    ];
    return (
        <>
            <main className={styles['about-main']}>
                <div className={styles['about-logos']}>
                    <img src={AztuLogo} alt="aztu-logo" />
                    <img src={ThikLogo} alt="thik-logo" />
                    {/* <img src={DigiMealLogo} alt="digi-meal-logo" /> */}
                    {/* DigiMeal Logo will be there */}
                </div>
                <div className={styles['about-digimeal-text-container']}>
                    <h2>DigiMeal</h2>
                    <p className={styles['about-digimeal-text']}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Amet quisquam voluptas atque optio doloribus nostrum.
                        Rerum voluptas nostrum exercitationem aperiam incidunt
                        cumque aut iusto doloribus voluptatum laborum numquam eaque,
                        est voluptates amet vel maxime in molestias ullam libero commodi
                        aliquam? Repellendus ab delectus sunt dignissimos, necessitatibus non.
                        Sint, et voluptatem.
                    </p>
                </div>
                <div className={styles['developer-img-container']}>
                    <img
                        className={styles['developer-img']}
                        src={DeveloperImageTest}
                        alt="developer-staff" />
                </div>
                <div className={styles['developer-contact-info']}>
                    <div className={styles['front-developer-info']}>
                        <div className={styles['front-dev-profile-info']}>
                            <img src={ProfileImg} alt="front-dev" />
                            <div className={styles['front-dev-profile-text']}>
                                <h3 className={styles['front-dev-name']}>Firdovsi Rzaev</h3>
                                <p className={styles['front-dev-job-name']}>Front-end Developer</p>
                            </div>
                        </div>
                        <div className={styles['front-dev-socials']}>
                            {socialIcons.map((item) => {
                                return (
                                    <div className={styles['front-dev-social-icon-container']}>
                                        <a href="#">
                                            {item}
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className={styles['back-developer-info']}>
                        <div className={styles['back-dev-profile-info']}>
                            <img src={ProfileImg} alt="back-dev" />
                            <div className={styles['back-dev-profile-text']}>
                                <h3 className={styles['back-dev-name']}>Firdovsi Rzaev</h3>
                                <p className={styles['back-dev-job-name']}>Back-end Developer</p>
                            </div>
                        </div>
                        <div className={styles['back-dev-socials']}>
                            {socialIcons.map((item) => {
                                return (
                                    <div className={styles['back-dev-social-icon-container']}>
                                        <a href="#">
                                            {item}
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
