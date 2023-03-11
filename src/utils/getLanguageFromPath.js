import { TRANSLATION_LANGUAGES } from '../config';

const getLanguageFromPath = path => {
  if (!path) {
    return 'fi';
  }

  const parts = path.split('/').filter(Boolean);
  const language = parts[0];

  return TRANSLATION_LANGUAGES.includes(language) ? language : 'fi';
};

export default getLanguageFromPath;
