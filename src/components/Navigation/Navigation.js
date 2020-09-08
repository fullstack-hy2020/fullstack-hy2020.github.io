import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Navigation.scss';

import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { NavigationItem } from './Item';
import SearchLink from './SearchLink';

export const navigation = {
  en: [
    { text: 'About course', path: '/en/about' },
    { text: 'Course contents', path: '/en#course-contents' },
    { text: 'FAQ', path: '/en/faq' },
    { text: 'Partners', path: '/en/companies' },
    { text: 'Challenge', path: '/en/challenge' },
  ],
  fi: [
    { text: 'Kurssista', path: '/about' },
    { text: 'Kurssin sisältö', path: '#course-contents' },
    { text: 'FAQ', path: '/faq' },
    { text: 'Kurssilla mukana', path: '/companies' },
  ],
  zh: [
    { text: '关于课程', path: '/zh/about' },
    { text: '课程内容', path: '/zh#course-contents' },
    { text: '常见问题', path: '/zh/faq' },
    { text: '合作伙伴', path: '/zh/companies' },
    { text: '挑战', path: '/zh/challenge' },
  ],
};

const searchIsEnabledForLang = lang => {
  return ['fi', 'en'].includes(lang);
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
    const { className, lang } = this.props;
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
            {navigation[lang].map(i => (
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

export default Navigation;
