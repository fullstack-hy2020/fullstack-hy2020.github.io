const getTranslationPath = (language, path) => {
  return language === 'fi' ? path : `/${language}${path}`;
};

export default getTranslationPath;
