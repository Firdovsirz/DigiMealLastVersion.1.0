import i18n from 'i18next';
import { fabClasses } from '@mui/material';
import { initReactI18next } from 'react-i18next';

// EN
import translationEnLogin from "./locales/en/login.json";
import translationEnUser from "./locales/en/user.json";

// RU
import translationRuLogin from "./locales/ru/login.json";
import translationRuUser from "./locales/ru/user.json";

// AZ
import translationAzLogin from "./locales/az/login.json";
import translationAzUser from "./locales/az/user.json";

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
        ns: ['main', 'login', 'user'],
        defaultNS: 'login'
    });

export default i18n;