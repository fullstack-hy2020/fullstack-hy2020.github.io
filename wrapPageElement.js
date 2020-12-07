import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

const isSSR = typeof window === 'undefined';

const LanguageWrapper = ({ language, children }) => {
  const { i18n } = useTranslation();

  if (isSSR) {
    i18n.changeLanguage(language);
  }

  useEffect(
    () => {
      language !== i18n.language && i18n.changeLanguage(language);
    },
    [language, i18n]
  );

  return children;
};

const wrapPageElement = ({ element, props }) => {
  const { pageContext } = props;
  const { langKey, lang } = pageContext;
  const language = langKey || lang;

  return <LanguageWrapper language={language}>{element}</LanguageWrapper>;
};

export default wrapPageElement;
