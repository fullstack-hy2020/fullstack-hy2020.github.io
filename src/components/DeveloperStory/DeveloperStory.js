import './DeveloperStory.scss';

import React, { Component } from 'react';

import { BodyText } from '../BodyText/BodyText';
import Element from '../Element/Element';
import { Image } from '../Image/Image';
import { PropTypes } from 'prop-types';
import { TripleBorder } from '../TripleBorder/TripleBorder';

export class DeveloperStory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      readMore: false,
    };
  }

  render() {
    const { image, companyLogo, text, name, title } = this.props;
    const { readMore } = this.state;

    return (
      <Element
        flex
        spaceBetween
        className="col-8 col-10--mobile push-right-1 spacing--small spacing--after"
      >
        <TripleBorder
          largeMargin
          className="developer-story__image col-3 col-7--mobile"
        >
          <Image squareBig src={require(`../../images/${image}`)} alt={name} />
        </TripleBorder>

        <Element className="col-6 col-8--mobile spacing--mobile">
          {companyLogo && (
            <img
              className="col-5--mobile"
              style={{ width: 'auto', maxHeight: '60px', objectFit: 'cover' }}
              src={require(`../../images/story_logos/${companyLogo}`)}
              alt={companyLogo.split('.')[0]}
            />
          )}

          <BodyText
            headingFont
            className="col-10"
            text={readMore ? text : text[0]}
          />

          {!readMore && (
            <button
              onClick={() => this.setState({ readMore: true })}
              className="col-10 developer-story__read-more"
            >
              Lue lisää
            </button>
          )}

          <p className="col-10 developer-story__name">{name}</p>

          <p className="col-10 developer-story__title">{title}</p>
        </Element>
      </Element>
    );
  }
}

DeveloperStory.defaultProps = {
  image: null,
  companyLogo: null,
  text: '',
  name: '',
  title: '',
};

DeveloperStory.propTypes = {
  image: PropTypes.string.isRequired,
  companyLogo: PropTypes.string.isRequired,
  text: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
