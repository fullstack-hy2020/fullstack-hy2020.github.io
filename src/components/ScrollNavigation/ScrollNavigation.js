import './ScrollNavigation.scss';

import { Link } from 'gatsby';
import kebabCase from 'lodash/fp/kebabCase';
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
    const headingList = Array.from(document.querySelectorAll('h1, h3'));
    const headings = headingList.map(i => {
      i.id = kebabCase(i.innerText);

      return {
        text: i.innerText,
        id: i.id,
        level: i.nodeName,
      };
    });

    this.setState({ headings: headings });
  };

  render() {
    const { headings } = this.state;
    const { letter, currentPath } = this.props;

    return (
      <Element
        tag="ul"
        flex
        dirColumn
        className={`scroll-navigation ${this.props.className}`}
      >
        {headings.map(i =>
          i.level === 'H1' ? (
            <li key={i.text} className="level-h1">
              {`${letter} ${i.text}`}
            </li>
          ) : (
            <ul>
              <Link to={`${currentPath}#${i.id}`}>{i.text}</Link>
            </ul>
          )
        )}
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
