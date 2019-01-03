import './ScrollNavigation.scss';

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Element from '../Element/Element';

class ScrollNavigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      headings: [],
    };
  }

  componentDidMount = () => {
    const courseTop = document.querySelector('.course').offsetTop;
    const headingList = Array.from(document.querySelectorAll('h1, h3'));
    const headings = headingList.map(i => ({
      text: i.innerText,
      top: i.offsetTop + courseTop,
    }));

    this.setState({ headings: headings });
  };

  render() {
    const { headings } = this.state;

    return (
      <Element
        tag="ul"
        flex
        dirColumn
        className={`scroll-navigation ${this.props.className}`}
      >
        {headings.map(i => (
          <li
            onClick={() => window.scrollTo({ top: i.top, behavior: 'smooth' })}
            key={i.text}
          >
            {i.text}
          </li>
        ))}
      </Element>
    );
  }
}

ScrollNavigation.defaultProps = {
  className: '',
};

ScrollNavigation.propTypes = {
  className: PropTypes.string,
};

export default ScrollNavigation;
