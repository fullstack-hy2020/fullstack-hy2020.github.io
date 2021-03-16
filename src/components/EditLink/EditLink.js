import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Element from '../Element/Element';
import './EditLink.scss';

const baseUrlByLanguage = {
  zh: 'https://github.com/RichardStark/fullstack-hy2020.github.io',
  es: 'https://github.com/sebastiantorres86/fullstack-hy2020.github.io',
};

const EditLink = ({ part, letter }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const link = lang === 'fi' ? `osa${part}` : `part${part}`;

  const baseUrl =
    baseUrlByLanguage[lang] ||
    'https://github.com/fullstack-hy2020/fullstack-hy2020.github.io';

  const url = `${baseUrl}/edit/source/src/content/${part}/${lang}/${link}${letter}.md`;

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
