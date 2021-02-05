import React from 'react';
import { Link } from 'gatsby';
import snakeCase from 'lodash/fp/snakeCase';
import { useTranslation } from 'react-i18next';

import navigation from '../../content/partnavigation/partnavigation';
import Element from '../Element/Element';
import { SubHeader } from '../SubHeader/SubHeader';
import getPartTranslationPath from '../../utils/getPartTranslationPath';

import Highlighter from 'react-highlight-words';

const SearchResults = ({ query, results = [] }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // search ids consist of a navigation path + sub heading path + id
  // eg: 'getting_started_with_git_hub_actions#exercise-11-2 99999999'
  const headingPath = id => id.split('#')[1].split(' ')[0];

  const headingTitle = id => {
    let str = headingPath(id).replace(/-/g, ' ');
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const resultsPath = (lang, letter, part, id) => {
    let nav = `/${snakeCase(navigation[lang][part][letter])}`;
    let base = getPartTranslationPath(lang, part, nav);
    let header = headingPath(id);
    return `${base}#${header}`;
  };

  const FullResults = ({ text }) => {
    if (text) {
      return (
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={[query]}
          autoEscape={true}
          textToHighlight={text.slice(0, 500)}
        />
      );
    }
  };

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
          {results.map(({ id, part, letter, text }) => (
            <li key={`${id}`}>
              <Link to={resultsPath(lang, letter, part, id)}>
                <div>
                  {`Part ${part}-${letter}: ${
                    navigation[lang][part][letter]
                  } #${headingTitle(id)}`}
                </div>
              </Link>
              <br />
              {text && <FullResults text={text} />}
            </li>
          ))}
        </ol>
      </Element>
    );
  }
};

export default SearchResults;
