import './Navigation.scss';

import React, { Component } from 'react';

import { NavigationItem } from './Item';
import PropTypes from 'prop-types';

export const navigation = {
  en: [
    { text: 'About course', path: '/en/about' },
    { text: 'Course contents', path: '/en#course-contents' },
    { text: 'FAQ', path: '/en/faq' },
    { text: 'Participating in course', path: '/en/companies' },
    { text: 'Challenge', path: '/en/challenge' },
  ],
  fi: [
    { text: 'Kurssista', path: '/about' },
    { text: 'Kurssin sisältö', path: '#course-contents' },
    { text: 'FAQ', path: '/faq' },
    { text: 'Kurssilla mukana', path: '/companies' },
    { text: 'Haaste', path: '/challenge' },
  ],
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
    const { className } = this.props;
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
            {navigation[this.props.lang].map(i => (
              <NavigationItem key={i.path} {...i} onClick={handleCloseMenu} />
            ))}
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
