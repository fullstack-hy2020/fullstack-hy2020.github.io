import './SearchImage.scss'

import React from 'react'
import { Link } from 'gatsby';
import searchIcon from '../../images/search-icon.svg';


const SearchImage = () => {
  return (
    <div className='search-image-container'>
      <Link 
      className="search__link"
      to='/search'
      >
        <img
          src={searchIcon}
          alt='search icon'
          className='search-image'
        />
      </Link>
    </div>
  )
}

export default SearchImage
