import i18n from 'i18next';
import { fabClasses } from '@mui/material';
import { initReactI18next } from 'react-i18next';

// EN
import translationEnUser from "./locales/en/user.json";
import translationEnLogin from "./locales/en/login.json";

// RU
import translationRuUser from "./locales/ru/user.json";
import translationRuLogin from "./locales/ru/login.json";

// AZ
import translationAzUser from "./locales/az/user.json";
import translationAzLogin from "./locales/az/login.json";

const resources = {
    en: {
        login: translationEnLogin,
        user: translationEnUser
    },
    ru: {
        login: translationRuLogin,
        user: translationRuUser
    },
    az: {
        login: translationAzLogin,
        user: translationAzUser
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
        ns: ['login', 'user'],
        defaultNS: 'login'
    });

export default i18n;