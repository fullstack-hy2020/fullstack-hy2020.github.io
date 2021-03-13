import './ScrollNavigation.scss';

import React, { Component } from 'react';

import Accordion from '../Accordion/Accordion';
import Element from '../Element/Element';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/fp/kebabCase';
import navigation from '../../content/partnavigation/partnavigation';
import snakeCase from 'lodash/fp/snakeCase';
import getPartTranslationPath from '../../utils/getPartTranslationPath';

class ScrollNavigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      headings: [],
      selectedItem: null,
    };
  }

  componentDidMount = () => {
    const headingList = Array.from(document.querySelectorAll('h3'));

    const headings = headingList.map(i => {
      i.id = kebabCase(i.innerText);
      i.classList.add('offset');

      return {
        text: i.innerText,
        id: i.id,
        level: i.nodeName,
      };
    });

    this.setState({ headings: headings });
    window.addEventListener('scroll', this.scrollHandler);
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  scrollHandler = () => {
    // Below implements 50 ms debounce
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }

    this.scrollTimer = setTimeout(() => {
      const scrollThreshold = window.scrollY;
      let last = this.state.headings[0];
      for (const heading of this.state.headings) {
        const elem = document.getElementById(heading.id);
        if (elem && elem.offsetTop >= scrollThreshold) {
          break;
        }
        last = heading;
      }
      if (this.state.selectedItem !== last.id) {
        this.setState({
          selectedItem: last.id,
        });
      }
    }, 50);
  };

  loopThroughPartsNode = partsNode => {
    const { headings } = this.state;
    const {
      part,
      letter,
      currentPath,
      currentPartTitle,
      colorCode,
      lang,
    } = this.props;
    let arr = [];

    for (let key in partsNode) {
      console.log(getPartTranslationPath(
        lang,
        part,
        `/${snakeCase(partsNode[key])}`
      ));

      if (currentPartTitle !== partsNode[key]) {
        arr.push(
          <Link
            key={key}
            className="left-navigation-link"
            style={{ borderColor: colorCode }}
            to={getPartTranslationPath(
              lang,
              part,
              `/${snakeCase(partsNode[key])}`
            )}
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
            selectedItem={this.state.selectedItem}
            list={headings.map(i => {
              return {
                id: i.id,
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
      <Element className="scroll-navigation-container">
        <Element className="scroll-navigation-container-inner">
          <Element
            tag="ul"
            dirColumn
            className={`scroll-navigation ${this.props.className}`}
          >
            {this.loopThroughPartsNode(navigation[this.props.lang][part])}
          </Element>
        </Element>
      </Element>
    );
  }
}

ScrollNavigation.defaultProps = {
  className: '',
  lang: 'fi',
};

ScrollNavigation.propTypes = {
  className: PropTypes.string,
  lang: PropTypes.string.isRequired,
  colorCode: PropTypes.string.isRequired,
};

export default ScrollNavigation;
