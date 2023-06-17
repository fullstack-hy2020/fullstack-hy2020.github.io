import translationProgress from './translationProgress';

const getPartTranslationPath = (language, part, path = '') => {
  // while the translation are not complete, return the URL for english version
  if (translationProgress[language] < part) {
    return `/en/part${part}${path}`;
  }
  return language === 'fi'
    ? `/osa${part}${path}`
    : `/${language}/part${part}${path}`;
};

export default getPartTranslationPath;
