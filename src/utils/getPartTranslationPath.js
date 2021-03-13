const getPartTranslationPath = (language, part, path = '') => {
  return language === 'fi' ? `/osa${part}${path}` : `/${language}/part${part}${path}`;
};

export default getPartTranslationPath;
