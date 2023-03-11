import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Element from '../Element/Element';
import './EditLink.scss';

const BASE_URL =
  'https://github.com/fullstack-hy2020/fullstack-hy2020.github.io';

const EditLink = ({ part, letter }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const link = lang === 'fi' ? `osa${part}` : `part${part}`;

  const url = `${BASE_URL}/edit/source/src/content/${part}/${lang}/${link}${letter}.md`;

  return (
    <Element flex className="container spacing" centered>
      <a className="edit-link" target="__BLANK" href={url}>
        <span>{t('proposeChanges')}</span>
      </a>
    </Element>
  );
};

EditLink.propTypes = {
  part: PropTypes.number.isRequired,
  letter: PropTypes.string.isRequired,
};

export default EditLink;
