const getPartTranslationPath = (language, part, path = '') => {
  // while the ptbr translation are not complete, return the URL for english version
  if (language === 'ptbr' && part >= 4) {
    // parts 0-3 are done. For part 4 onward, this will return the english version
   return  `/en/part${part}${path}`
  }
  return language === 'fi' ? `/osa${part}${path}` : `/${language}/part${part}${path}`;
};

export default getPartTranslationPath;
