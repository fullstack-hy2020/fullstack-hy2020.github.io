import './ScrollNavigation.scss';

import { Link } from 'gatsby';
import kebabCase from 'lodash/fp/kebabCase';
import snakeCase from 'lodash/fp/snakeCase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import navigation from '../../content/partnavigation/partnavigation';
import Accordion from '../Accordion/Accordion';
import Element from '../Element/Element';

class ScrollNavigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      h1Top: 0,
      headings: [],
    };
  }

  componentDidMount = () => {
    const headingList = Array.from(document.querySelectorAll('h3'));
    const h1 = document.querySelector('h1');

    const headings = headingList.map(i => {
      i.id = kebabCase(i.innerText);
      i.classList.add('offset');

      return {
        text: i.innerText,
        id: i.id,
        level: i.nodeName,
      };
    });

    this.setState({ headings: headings, h1Top: h1.offsetTop });
  };

  loopThroughPartsNode = partsNode => {
    const { headings } = this.state;
    const {
      part,
      letter,
      currentPath,
      currentPartTitle,
      colorCode,
    } = this.props;
    let arr = [];

    for (let key in partsNode) {
      if (currentPartTitle !== partsNode[key]) {
        arr.push(
          <Link
            key={key}
            className="left-navigation-link"
            style={{ borderColor: colorCode }}
            to={`/osa${part}/${snakeCase(partsNode[key])}`}
          >{`${key} ${partsNode[key]}`}</Link>
        );
      } else {
        arr.push(
          <Accordion
            containerClassName="accordion--side-navigation"
            style={{ color: colorCode }}
            titleStyle={{
              backgroundColor: colorCode,
              borderColor: colorCode,
            }}
            initiallyOpened
            key={key}
            title={`${letter} ${partsNode[key]}`}
            list={headings.map(i => {
              return {
                href: `${currentPath}#${i.id}`,
                text: i.text,
              };
            })}
          />
        );
      }
    }
    return arr;
  };

  render() {
    const { part } = this.props;

    return (
      <Element
        tag="ul"
        flex
        dirColumn
        className={`scroll-navigation ${this.props.className}`}
      >
        {this.loopThroughPartsNode(navigation[part])}
      </Element>
    );
  }
}

ScrollNavigation.defaultProps = {
  className: '',
};

ScrollNavigation.propTypes = {
  className: PropTypes.string,
  colorCode: PropTypes.string.isRequired,
};

export default ScrollNavigation;
