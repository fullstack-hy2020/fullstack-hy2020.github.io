import './ScrollNavigation.scss';

import kebabCase from 'lodash/fp/kebabCase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Accordion from '../Accordion/Accordion';
import Element from '../Element/Element';

const partMainTitles = {
  0: ['Yleistä', 'Web-sovelluksen toimintaperiaatteita'],
  1: [
    'Reactin alkeet',
    'Javascript',
    'Komponentin tila ja tapahtumankäsittely',
    'Monimutkaisempi tila, Reactin debuggaus',
  ],
  2: ['Web-sovellusten toiminnan perusteet', 'React', 'Javascript'],
  3: [
    'Web-sovellusten toiminnan perusteet',
    'Node.js/Express',
    'Mongo',
    'Konfiguraatiot',
  ],
  4: [
    'Node.js/Express',
    'Node.js -sovellusten testaus',
    'JS',
    'Mongoose',
    'Web',
  ],
  5: [
    'React',
    'Frontendin testauksen alkeet',
    'Redux',
    'React+Redux',
    'Javascript',
  ],
  6: ['Redux', 'React+Redux', 'React'],
  7: [
    'Webpack',
    'Tyylien lisääminen sovellukseen',
    'Testaus',
    'React',
    'React/Node-sovellusten tietoturva',
    'Tyypitys',
    'Tulevaisuuden trendejä',
  ],
  8: ['GraphQL'],
};

class ScrollNavigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      top: 0,
      h1Top: 0,
      headings: [],
      navigationClass: 'scroll-navigation',
    };
  }

  componentDidMount = () => {
    const headingList = Array.from(document.querySelectorAll('h3'));
    const h1 = document.querySelector('h1');

    const headings = headingList.map(i => {
      i.id = kebabCase(i.innerText);

      return {
        text: i.innerText,
        id: i.id,
        level: i.nodeName,
      };
    });

    this.setState({ headings: headings, h1Top: h1.offsetTop });

    window.addEventListener('scroll', this.handleScroll);
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    let scroll = window.scrollY;

    const { top, h1Top } = this.state;

    this.setState({
      top: scroll,
      navigationClass: top > h1Top ? 'scroll-navigation--top' : '',
    });
  };

  render() {
    const { headings, navigationClass } = this.state;
    const { part, letter, currentPath, currentPartTitle } = this.props;

    return (
      <Element
        tag="ul"
        flex
        dirColumn
        className={`scroll-navigation ${
          this.props.className
        } ${navigationClass}`}
      >
        {partMainTitles[part].map(t => (
          <Accordion
            containerClassName="accordion--side-navigation"
            initiallyOpened={currentPartTitle === t}
            key={t}
            title={`${letter} ${t}`}
            list={headings.map(i => {
              return { href: `${currentPath}#${i.id}`, text: i.text };
            })}
          />
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
