import './LanguageSwitcher.scss';

import PropTypes from 'prop-types';
import React from 'react';

const Language = ({ language, active }) => {
  return language === active ? (
    <span className="language-switcher__active-language">{language}</span>
  ) : (
    <a target="_self" className="language-switcher__language" href={active === 'en' ? '/' : '/en'}>{language}</a>
  );
};

const LanguageSwitcher = ({ lang }) => {
  return (
    <div className="language-switcher">
      <Language language="fi" active={lang} />

      <Language language="en" active={lang} />
    </div>
  );
};

LanguageSwitcher.defaultProps = {
  lang: 'fi',
};

LanguageSwitcher.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default LanguageSwitcher;
