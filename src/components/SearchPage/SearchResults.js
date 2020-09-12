import React from 'react';
import { Link } from 'gatsby';
import navigation from '../../content/partnavigation/partnavigation';
import snakeCase from 'lodash/fp/snakeCase';
import Element from '../Element/Element';
import { SubHeader } from '../SubHeader/SubHeader';

const TRANSLATIONS = {
  fi: {
    noMatches: 'Hakutuloksia ei löytynyt',
    resultsTitle: ({ count, query }) =>
      `Löytyi ${count} osumaa haulle "${query}"`,
  },
  en: {
    noMatches: 'No matches found',
    resultsTitle: ({ count, query }) =>
      `Found ${count} matches for query "${query}"`,
  },
  zh: {
    noMatches: '没有匹配的结果',
    resultsTitle: ({ count, query }) =>
      `找到 ${count} 条关于 "${query}" 的结果`,
  },
};

const SearchResults = ({ query, results = [], lang = 'en' }) => {
  const translations = TRANSLATIONS[lang] || TRANSLATIONS.en;

  if (results.length === 0) {
    return (
      <Element>
        <SubHeader text={translations.noMatches} headingLevel="h2" />
      </Element>
    );
  }

  if (results.length > 0) {
    return (
      <Element>
        <SubHeader
          text={translations.resultsTitle({ count: results.length, query })}
          headingLevel="h2"
        />

        <ol>
          {results.map(({ part, letter }) => (
            <li key={`${part}${letter}`}>
              <Link
                to={`/${lang === 'en' ? 'en/part' : lang === 'zh' ? 'zh/part' : 'osa'}${part}/${snakeCase(
                  navigation[lang][part][letter]
                )}`}
              >
                <div>
                  {`part ${part}, ${letter}: ${navigation[lang][part][letter]}`}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </Element>
    );
  }
};

export default SearchResults;
