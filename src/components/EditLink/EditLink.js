import './EditLink.scss';

import Element from '../Element/Element';
import PropTypes from 'prop-types';
import React from 'react';

const EditLink = ({ part, letter, lang }) => {
  const link = lang === 'en' ? `part${part}/part` : `osa${part}/osa`;

  return (
    <Element flex className="container spacing" centered>
      <a
        className="edit-link"
        target="__BLANK"
        href={`https://github.com/fullstackopen-2019/fullstackopen-2019.github.io/edit/source/src/content/${link}${part}${letter}.md`}
      >
        <span>
          {lang === 'en'
            ? 'Propose changes to material'
            : 'Ehdota muutosta materiaalin sisältöön'}
        </span>
      </a>
    </Element>
  );
};

EditLink.propTypes = {
  part: PropTypes.number.isRequired,
  letter: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
};

export default EditLink;
