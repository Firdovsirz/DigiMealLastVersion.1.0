import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RuFlag from "../../assets/Language/ru-flag.png";
import AzFlag from "../../assets/Language/az-flag.png";
import UsaFlag from "../../assets/Language/usa-flag.png";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styles from "../LanguageChanger/LanguageChanger.module.scss";

export default function LanguageChanger({ position, top, right, bottom }) {
    const [currentLang, setCurrentLang] = useState('Az');
    const [currentFlag, setCurrentFlag] = useState(AzFlag);
    const [dropdown, setDropdown] = useState(false);
    const { t, i18n } = useTranslation();
    const handleDropdown = () => {
        setDropdown(!dropdown);
    }
    const handleLangChange = (e) => {
        setDropdown(false)
        setCurrentLang(e);
        if (e === 'En') {
            setCurrentFlag(UsaFlag);
            i18n.changeLanguage('en');
            console.log(e);
        } else if (e === 'Ru') {
            setCurrentFlag(RuFlag);
            i18n.changeLanguage('ru');
            console.log(e);
        } else if (e === 'Az') {
            setCurrentFlag(AzFlag);
            i18n.changeLanguage('az');
            console.log(e);

        }
    }
    const availableLanguages = [
        currentLang === 'En' ? null : 'En',
        currentLang === 'Az' ? null : 'Az',
        currentLang === 'Ru' ? null : 'Ru'
    ];
    const availableFlags = [
        currentLang === 'En' ? null : UsaFlag,
        currentLang === 'Az' ? null : AzFlag,
        currentLang === 'Ru' ? null : RuFlag
    ];

    return (
        <div
            className={styles['lang-changer-main']}
            style={{ position: position, top: top, right: right, bottom: bottom }}>
            <div className={styles['lang-changer-container']}>
                <div className={styles['current-lang']} onClick={handleDropdown}>
                    <div className={styles['current-lang-info']}>
                        <img src={currentFlag} alt="flag" />
                        <p>{currentLang}</p>
                    </div>
                    <ArrowDropDownIcon />
                </div>
                {dropdown ? <div className={styles['available-languages']}>
                    <div className={styles['lang-dropdown-container']}>
                        {availableLanguages.map((item, index) => {
                            {
                                if (item != null) {
                                    console.log(item)
                                    return (
                                        <div
                                            onClick={() => handleLangChange(item)}
                                            key={index}
                                            className={styles['available-lang-container']}>
                                            <img src={availableFlags[index]} alt="" />
                                            <p>{item}</p>
                                        </div>
                                    )
                                }
                            }
                        })}
                    </div>
                </div> : null}
            </div>
        </div>
    )
}
