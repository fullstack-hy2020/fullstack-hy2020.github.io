import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import './Navigation.scss';

import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { NavigationItem } from './Item';
import SearchLink from './SearchLink';

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
      path: getTranslationPath('#course-contents', language),
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
  return ['fi', 'en', 'zh'].includes(lang);
};

const handleCloseMenu = () =>
  document.body.classList.remove('is-open--navigation');

const handleHamburgerClick = () => {
  document.body.classList.toggle('is-open--navigation');
};

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigationOpen: false,
    };
  }

  render() {
    const { className, i18n, t } = this.props;
    const lang = i18n.language;
    const navigation = getNavigation(lang, t);
    const showSearchLink = searchIsEnabledForLang(lang);

    return (
      <div className={`navigation__wrapper ${className}`}>
        <button
          aria-label="Navigation menu"
          aria-expanded={this.state.navigationOpen}
          onClick={() => {
            this.setState({
              navigationOpen: !this.state.navigationOpen,
            });
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

            <LanguageSwitcher lang={lang} />
            {showSearchLink && <SearchLink lang={lang} />}
          </ul>
        </nav>
      </div>
    );
  }
}

Navigation.propTypes = {
  className: PropTypes.string,
};

Navigation.defaultProps = {
  className: '',
};

export default withTranslation()(Navigation);
