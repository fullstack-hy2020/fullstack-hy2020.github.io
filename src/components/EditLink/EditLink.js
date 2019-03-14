import './EditLink.scss';

import Element from '../Element/Element';
import PropTypes from 'prop-types';
import React from 'react';

const EditLink = ({ part, letter }) => (
  <Element flex className="container spacing" centered>
    <a
      className="edit-link"
      target="__BLANK"
      href={`https://github.com/fullstackopen-2019/fullstackopen-2019.github.io/edit/source/src/content/osa${part}/osa${part}${letter}.md`}
    >
      <span>Ehdota muutosta materiaalin sisältöön</span>
    </a>
  </Element>
);

EditLink.propTypes = {
  part: PropTypes.number.isRequired,
  letter: PropTypes.string.isRequired,
};

export default EditLink;
