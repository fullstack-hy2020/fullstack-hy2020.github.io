import React from 'react';
import { graphql } from 'gatsby';

import SearchPage from '../components/SearchPage';

const Search = ({ data }) => (
  <SearchPage
    localSearch={data.localSearchFinnish}
    title="Etsi hakusanalla materiaalista"
    inputPlaceholder="Syötä hakusana"
    lang="fi"
  />
);

export const pageQuery = graphql`
  query {
    localSearchFinnish {
      store
      index
    }
  }
`;

export default Search;
