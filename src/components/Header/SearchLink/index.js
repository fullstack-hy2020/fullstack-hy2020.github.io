import React from 'react';
import { Link } from 'gatsby';

import SearchIcon from '../../SearchIcon';
import styles from './SearchLink.module.scss';

const getLinkTo = lang => {
  return lang === 'fi' ? '/search' : `/${lang}/search`;
};

const SearchLink = ({ lang }) => {
  return (
    <Link to={getLinkTo(lang)} className={styles.searchLink}>
      <SearchIcon aria-label="Search from the material" />
    </Link>
  );
};

export default SearchLink;
