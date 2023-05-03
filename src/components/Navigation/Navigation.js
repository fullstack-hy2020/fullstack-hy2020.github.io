import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { navigate } from '@reach/router';

import './Navigation.scss';

import LanguagePicker from '../LanguagePicker';
import { NavigationItem } from './Item';
import SearchLink from './SearchLink';
import ThemeSwitcher from './ThemeSwitcher';
import { RTL_LANGUAGES } from '../../config';

const getTranslationPath = (path, language) => {
  return language === 'fi' ? path : `/${language}${path}`;
};

export const getNavigation = (language, t) => {
  return [
    {
      text: t('navigation:aboutCourse'),
      path: getTranslationPath('/about', language),
    },
    {
      text: t('navigation:courseContents'),
      path: getTranslationPath('/#course-contents', language),
    },
    { text: t('navigation:faq'), path: getTranslationPath('/faq', language) },
    {
      text: t('navigation:partners'),
      path: getTranslationPath('/companies', language),
    },
    {
      text: t('navigation:challenge'),
      path: getTranslationPath('/challenge', language),
    },
  ];
};

const searchIsEnabledForLang = lang => {
  return ['fi', 'en', 'zh', 'ptbr', 'ar'].includes(lang);
};

const handleCloseMenu = () =>
  document.body.classList.remove('is-open--navigation');

const handleHamburgerClick = () => {
  document.body.classList.toggle('is-open--navigation');
};

const handleRightToLeftLang = lang => {
  if (RTL_LANGUAGES.includes(lang)) {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }
};

const Navigation = props => {
  const { t, i18n } = useTranslation();
  const [navigationOpen, setNavigationOpen] = useState(false);

  const { className = '' } = props;
  const lang = i18n.language;
  const navigation = getNavigation(lang, t);
  const showSearchLink = searchIsEnabledForLang(lang);

  useEffect(() => {
    handleRightToLeftLang(lang);
  }, [lang]);

  const onLanguageChange = newLang => {
    navigate(getTranslationPath('/', newLang));
    handleRightToLeftLang(newLang);
  };

  return (
    <div className={`navigation__wrapper ${className}`}>
      <button
        aria-label="Navigation menu"
        aria-expanded={navigationOpen}
        onClick={() => {
          setNavigationOpen(prevOpen => !prevOpen);
          handleHamburgerClick();
        }}
        className="navigation__toggle"
      >
        <div className="navigation__toggle-icon" />
      </button>
      <nav>
        <ul className="navigation">
          {navigation.map(i => (
            <NavigationItem key={i.path} {...i} onClick={handleCloseMenu} />
          ))}

          <div className="navigation__icon-buttons">
            {showSearchLink && <SearchLink lang={lang} />}
            <ThemeSwitcher />
          </div>
          <LanguagePicker
            className="navigation__language-picker"
            onChange={onLanguageChange}
            value={lang}
          />
        </ul>
      </nav>
    </div>
  );
};

Navigation.propTypes = {
  className: PropTypes.string,
};

export default Navigation;
