import React from 'react';
import { Link } from 'gatsby';

import SearchIcon from '../../SearchIcon';
import SrOnly from '../../SrOnly';
import styles from './SearchLink.module.scss';

const getLinkTo = lang => {
  return lang === 'fi' ? '/search' : `/${lang}/search`;
};

const TRANSLATIONS = {
  fi: {
    label: 'Hae materiaalista',
  },
  en: {
    label: 'Search from the material',
  },
};

const SearchLink = ({ lang }) => {
  const translations = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <Link to={getLinkTo(lang)} className={styles.searchLink}>
      <SrOnly>{translations.label}</SrOnly>
      <SearchIcon />
    </Link>
  );
};

export default SearchLink;
