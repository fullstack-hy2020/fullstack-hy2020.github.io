import './DeveloperStory.scss';

import { BodyText } from '../BodyText/BodyText';
import Element from '../Element/Element';
import {Image} from '../Image/Image';
import { PropTypes } from 'prop-types';
import React from 'react';
import { TripleBorder } from '../TripleBorder/TripleBorder';

export const DeveloperStory = ({ image, companyLogo, text, name, title }) => (
  <Element
    flex
    spaceBetween
    className="col-8 col-10--mobile push-right-1 spacing--small spacing--after"
  >
    <TripleBorder largeMargin className="developer-story__image col-3 col-7--mobile">
      <Image squareBig src={require(`../../images/${image}`)} alt={name} />
    </TripleBorder>

    <Element className="col-6 col-8--mobile spacing--mobile">
      {companyLogo && (
        <img
          className="col-2 col-5--mobile"
          src={require(`../../images/${companyLogo}`)}
          alt={companyLogo.split('.')[0]}
        />
      )}

      <BodyText headingFont className="col-10" text={text} />

      <p className="col-10 developer-story__name">{name}</p>

      <p className="col-10 developer-story__title">{title}</p>
    </Element>
  </Element>
);

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
