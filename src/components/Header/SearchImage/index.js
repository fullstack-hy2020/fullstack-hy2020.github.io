import React from 'react'
import { Link } from 'gatsby';
import searchIcon from '../../../images/search-icon.svg';
import styles from './SearchImage.module.css'

const SearchImage = ({ lang }) => {
  return (
    <div className={styles.container}>
      <Link
        to={
          lang === 'fi'
            ? '/search'
            : '/en/search'
        }
      >
        <img
          src={searchIcon}
          alt='search icon'
          className={styles.image}
        />
      </Link>
    </div>
  )
}

export default SearchImage
