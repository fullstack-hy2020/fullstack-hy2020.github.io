import './EditLink.scss';

import Element from '../Element/Element';
import PropTypes from 'prop-types';
import React from 'react';

const EditLink = ({ part, letter, lang }) => {
  const link = lang === 'en' ? `part${part}` : lang === 'zh' ? `part${part}` :`osa${part}`;

  return (
    <Element flex className="container spacing" centered>
      <a
        className="edit-link"
        target="__BLANK"
        href={lang === 'zh'? 
        `https://github.com/RichardStark/fullstack-hy2020.github.io/edit/source/src/content/${part}/${lang}/${link}${letter}.md`
        :`https://github.com/fullstack-hy2020/fullstack-hy2020.github.io/edit/source/src/content/${part}/${lang}/${link}${letter}.md`}
      >
        <span>
          {lang === 'en'
            ? 'Propose changes to material'
            :lang === 'zh'
            ? '对讲课材料提出建议'
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
