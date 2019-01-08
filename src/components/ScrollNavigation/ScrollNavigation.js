import './ScrollNavigation.scss';

import kebabCase from 'lodash/fp/kebabCase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Accordion from '../Accordion/Accordion';
import Element from '../Element/Element';

const partMainTitles = {
  0: ['Yleistä', 'Web-sovelluksen toimintaperiaatteita'],
  1: [
    'Reactin alkeet,',
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
      headings: [],
    };
  }

  componentDidMount = () => {
    const headingList = Array.from(document.querySelectorAll('h3'));
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
    const { part, letter, currentPath, currentPartTitle } = this.props;

    return (
      <Element
        tag="ul"
        flex
        dirColumn
        className={`scroll-navigation ${this.props.className}`}
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
