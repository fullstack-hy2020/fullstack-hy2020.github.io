import React from 'react'
import { Link } from 'gatsby';
import searchIcon from '../../images/search-icon.svg';
import imageIconStyles from './searchImage.module.css'

const SearchImage = ({ lang }) => {
  return (
    <div className={imageIconStyles.container}>
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
          className={imageIconStyles.image}
        />
      </Link>
    </div>
  )
}

export default SearchImage
