import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useFlexSearch } from 'react-use-flexsearch';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

import Layout from '../layout';
import SearchResults from './SearchResults';
import Element from '../Element/Element';
import InputField from './InputField';
import { SubHeader } from '../SubHeader/SubHeader';
import SrOnly from '../SrOnly';

const SearchPage = ({
  localSearch,
  title = 'Search from the material',
  inputPlaceholder = 'Enter query word',
  lang = 'en',
}) => {
  const { index, store } = localSearch;
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  const { t } = useTranslation();

  const handleInpuptChange = event => {
    setQuery(event.target.value);
  };

  const results = useFlexSearch(debouncedQuery, index, store);
  const filteredResults = results.filter(res => res.letter !== null);
  const showResults = Boolean(query);

  return (
    <Layout>
      <Element className="container spacing spacing--after">
        <SubHeader headingLevel="h1" text={title} />

        <Element className="container">
          <SrOnly>
            <label htmlFor="search-input">
              {t('navigation:searchLinkSrLabel')}
            </label>
          </SrOnly>
          <InputField
            id="search-input"
            type="search"
            value={query}
            onChange={handleInpuptChange}
            placeholder={inputPlaceholder}
            className={cn({ 'spacing--after': showResults })}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          />

          {showResults && (
            <SearchResults
              results={filteredResults}
              query={query}
              lang={lang}
            />
          )}
        </Element>
      </Element>
    </Layout>
  );
};

export default SearchPage;
