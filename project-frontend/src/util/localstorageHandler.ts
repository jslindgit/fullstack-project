import { Language } from '../types/languageTypes';

import { defaultLanguage } from '../constants';

// Language:
const getLang = (): Language => {
    const lang = localStorage.getItem('language');
    if (lang) {
        return JSON.parse(lang);
    } else {
        setLang(defaultLanguage);
        return defaultLanguage;
    }
};

const setLang = (lang: Language) => {
    localStorage.setItem('language', JSON.stringify(lang));
};

// Previous location:
const getPreviousLocation = (): string => {
    const location = localStorage.getItem('previousLocation');
    return location ? location : '/';
};

const setPreviousLocation = (location: string): void => {
    localStorage.setItem('previousLocation', location);
};

export default {
    getLang,
    setLang,
    getPreviousLocation,
    setPreviousLocation,
};
