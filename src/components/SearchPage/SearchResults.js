import React from 'react';
import { Link } from 'gatsby';
import snakeCase from 'lodash/fp/snakeCase';
import { useTranslation } from 'react-i18next';

import navigation from '../../content/partnavigation/partnavigation';
import Element from '../Element/Element';
import { SubHeader } from '../SubHeader/SubHeader';
import getPartTranslationPath from '../../utils/getPartTranslationPath';

const SearchResults = ({ query, results = [] }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (results.length === 0) {
    return (
      <Element>
        <SubHeader text={t('searchPage:noMatches')} headingLevel="h2" />
      </Element>
    );
  }

  if (results.length > 0) {
    return (
      <Element>
        <SubHeader
          text={t('searchPage:matchesTitle', { count: results.length, query })}
          headingLevel="h2"
        />

        <ol>
          {results.map(({ part, letter }) => (
            <li key={`${part}${letter}`}>
              <Link
                to={getPartTranslationPath(
                  lang,
                  part,
                  `/${snakeCase(navigation[lang][part][letter])}`
                )}
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
