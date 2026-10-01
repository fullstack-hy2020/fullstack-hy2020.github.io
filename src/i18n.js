import i18n from 'i18next';

import en from './locales/en';
import fi from './locales/fi';
import zh from './locales/zh';
import es from './locales/es';
import fr from './locales/fr';
import ptbr from './locales/ptbr';
import ar from './locales/ar.json'

const resources = {
  en,
  fi,
  zh,
  es,
  fr,
  ptbr,
  ar
};

i18n.init({
  resources,
  fallbackLng: 'en',
  lng: 'en',
  defaultNS: 'common',
  react: {
    useSuspense: false,
  },
});

export default i18n;
