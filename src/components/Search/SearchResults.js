import React from 'react';
import { Link } from 'gatsby';
import navigation from '../../content/partnavigation/partnavigation';
import snakeCase from 'lodash/fp/snakeCase';
import Element from '../Element/Element';
import { SubHeader } from '../SubHeader/SubHeader';

const SearchResults = ({ results, query, lang }) => {
  if (!query) {
    return null;
  }

  if (results.length === 0 && query) {
    return (
      <Element className="container spacing--after-small">
        <SubHeader
          className="spacing--after-small"
          text={
            lang === 'fi' ? 'Ei löytynyt. Tarkenna hakua' : 'No matches found'
          }
          headingLevel="h2"
        />
      </Element>
    );
  }

  if (results.length > 0 && query) {
    return (
      <Element className="container spacing--after-small">
        <SubHeader
          className="spacing--after-small"
          text={
            lang === 'fi'
              ? `Löytyi ${results.length} osumaa haulle "${query}"`
              : `Found ${results.length} matches for query "${query}"`
          }
          headingLevel="h2"
        />
        <Element className="container col-8 push-right-1">
          <ol className="search-results-list">
            {results.map(({ part, letter }) => (
              <li key={`${part}${letter}`}>
                <Link
                  to={`/${lang === 'en' ? 'en/part' : 'osa'}${part}/${snakeCase(
                    navigation[lang][part][letter]
                  )}`}
                >
                  <div>
                    {`part ${part}, ${letter}: ${
                      navigation[lang][part][letter]
                    }`}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </Element>
      </Element>
    );
  }
};

export default SearchResults;
