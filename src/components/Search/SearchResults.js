import './SearchResults.scss';

import React from 'react';
import { Link } from 'gatsby';
import navigation from '../../content/partnavigation/partnavigation'
import snakeCase from 'lodash/fp/snakeCase';
import Element from '../Element/Element';
import { SubHeader } from '../SubHeader/SubHeader';

const SearchResults = ({ results, query }) => {

  if (!query) {
    return null;
  }

  if (results.length === 0 && query) {
    return (
      <Element className="container spacing--after-small kissa">
        <SubHeader
          className="spacing--after-small"
          text='Ei löytynyt. Tarkenna hakua'
          headingLevel="h2"
        />        
      </Element>
    )
  }

  if (results.length > 0 && query) {
    return (
      <Element className="container spacing--after-small koira">
        <SubHeader
          className="spacing--after-small"
          text={`Löytyi ${results.length} osumaa haulle "${query}"`}
          headingLevel="h2"
        />        
        <Element className="container col-8 push-right-1">
          <ol className="search-results-list">
            {results.map(({ part, letter }) => (
              <li key={`${part}${letter}`}>
                <Link
                  to={
                    `/osa${part}/${snakeCase(navigation['fi'][part][letter])}`
                  }>
                  <div>
                    {`part ${part}, ${letter}: ${navigation['fi'][part][letter]}`}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </Element>
      </Element>
    )
  }
}


export default SearchResults;