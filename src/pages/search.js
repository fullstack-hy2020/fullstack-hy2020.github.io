import React, { useState } from 'react';
import { graphql } from "gatsby"
import Layout from '../components/layout';
import { useDebounce } from 'use-debounce';
import { useFlexSearch } from 'react-use-flexsearch';
import SearchResults from '../components/Search/SearchResults';
import Element from '../components/Element/Element';
import InputField from '../components/InputField/InputField';
import { BodyText } from '../components/BodyText/BodyText';
import Footer from '../components/Footer/Footer';

const Search = ({ data }) => { 
  const { index, store } = data.localSearchFinnish;
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);

  const handleInpuptChange = (event) => {
    setQuery(event.target.value);
  }

  const results = useFlexSearch(debouncedQuery, index, store);
  
  return (
    <Layout>
      <Element className="container spacing spacing--mobile--large">
        <Element className="col-8 push-right-1">
          <BodyText
            heading={{ level: 'h1', title: 'Etsi hakusanalla materiaalista' }}
            headingFontSize="2.3rem"
          />
        <Element
          className="container spacing--after-small"
        >
          <InputField
            type='search'
            value={query}
            onChange={handleInpuptChange}
            placeHolder='Syötä hakusana'
          />
        </Element>
        <SearchResults
          results={results.filter(res => res.letter !== null)}
          query={query}
          lang='fi'
        />
      </Element>
      </Element>
      <Footer lang='fi' />
    </Layout>
  )
};

export default Search;

export const pageQuery = graphql`
  query {
    localSearchFinnish {
      store
      index
    }
  }
`