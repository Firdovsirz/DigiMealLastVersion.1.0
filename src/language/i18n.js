import i18n from 'i18next';
import { fabClasses } from '@mui/material';
import { initReactI18next } from 'react-i18next';

// EN
import translationEnUser from "./locales/en/user.json";
import translationEnLogin from "./locales/en/login.json";
import translationEnHeader from "./locales/en/header.json";

// RU
import translationRuUser from "./locales/ru/user.json";
import translationRuLogin from "./locales/ru/login.json";
import translationRuHeader from "./locales/ru/header.json";

// AZ
import translationAzUser from "./locales/az/user.json";
import translationAzLogin from "./locales/az/login.json";
import translationAzHeader from "./locales/az/header.json";

const resources = {
    en: {
        user: translationEnUser,
        login: translationEnLogin,
        header: translationEnHeader,
    },
    ru: {
        user: translationRuUser,
        login: translationRuLogin,
        header: translationRuHeader,
    },
    az: {
        user: translationAzUser,
        login: translationAzLogin,
        header: translationAzHeader,
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'az',
        fallbackLng: 'az',
        interpolation: {
            escapeValue: fabClasses
        },
        ns: ['login', 'user', 'header'],
        defaultNS: 'login'
    });

export default i18n;