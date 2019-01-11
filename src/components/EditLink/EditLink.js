import './EditLink.scss';

import PropTypes from 'prop-types';
import React from 'react';

import Element from '../Element/Element';

const EditLink = ({ part, letter }) => (
  <Element flex className="container spacing" centered>
    <a
      className="edit-link"
      target="__BLANK"
      href={`https://github.com/fullstack-hy2019/fullstack-hy2019.github.io/edit/source/src/content/osa${part}/osa${part}${letter}.md`}
    >
      Ehdota muutosta materiaalin sisältöön
    </a>
  </Element>
);

EditLink.propTypes = {
  part: PropTypes.number.isRequired,
  letter: PropTypes.string.isRequired,
};

export default EditLink;
