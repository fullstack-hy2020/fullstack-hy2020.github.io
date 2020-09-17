import React from 'react';
import { Link } from 'gatsby';
import { useTranslation } from 'react-i18next';

import SearchIcon from '../../SearchIcon';
import SrOnly from '../../SrOnly';
import styles from './SearchLink.module.scss';

const getLinkTo = lang => {
  return lang === 'fi' ? '/search' : `/${lang}/search`;
};

const SearchLink = ({ lang }) => {
  const { t } = useTranslation();

  return (
    <Link to={getLinkTo(lang)} className={styles.searchLink}>
      <SrOnly>{t('navigation:searchLinkSrLabel')}</SrOnly>
      <SearchIcon />
    </Link>
  );
};

export default SearchLink;
